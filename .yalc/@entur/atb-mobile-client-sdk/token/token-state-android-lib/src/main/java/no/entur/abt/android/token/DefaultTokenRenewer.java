package no.entur.abt.android.token;

import android.util.Log;

import java.security.KeyStoreException;
import java.security.cert.CertificateException;
import java.time.Clock;
import java.util.Collections;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.attestation.DeviceAttestator;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.TokenCommandException;
import no.entur.abt.android.token.exception.TokenException;
import no.entur.abt.android.token.exception.TokenExpiredException;
import no.entur.abt.android.token.exception.TokenLocalTimeoutException;
import no.entur.abt.android.token.exception.TokenSupersededException;
import no.entur.abt.android.token.exception.UnableToIncludeCertificateException;
import no.entur.abt.android.token.exception.UnableToPerformCryptoOperationTokenException;
import no.entur.abt.android.token.exception.UnableToRenewTokenException;
import no.entur.abt.android.token.exception.UnableToSaveTokenException;
import no.entur.abt.android.token.keystore.TokenKeystoreException;
import no.entur.abt.android.token.remote.ActiveTokenDetails;
import no.entur.abt.android.token.remote.PendingTokenDetails;
import no.entur.abt.android.token.remote.RemoteTokenService;
import no.entur.abt.android.token.remote.exception.RemoteTokenStateException;
import no.entur.abt.android.token.remote.exception.TokenMustBeRenewedRemoteTokenStateException;
import no.entur.abt.android.token.remote.exception.TokenMustBeReplacedRemoteTokenStateException;
import no.entur.abt.android.token.remote.exception.TokenNotFoundRemoteTokenStateException;
import no.entur.abt.core.exchange.pb.v1.SecureContainer;

import uk.org.netex.www.netex.TokenAction;

/**
 *
 * For renewal of tokens.<br>
 *
 */

public class DefaultTokenRenewer<T> extends AbstractTokenFactory<T> implements TokenRenewer<T> {

	private static final String TAG = DefaultTokenRenewer.class.getName();

	public DefaultTokenRenewer(TokenStore<T> tokenStore, RemoteTokenService<T> channelManager, DeviceAttestator deviceAttestator, Clock clock, long timeout) {
		super(tokenStore, channelManager, deviceAttestator, clock, timeout);
	}

	// also throws StatusRuntimeException
	public ActivatedToken<T> renew(ActivatedToken<T> token, T traceId) throws DeviceAttestationException, TokenLocalTimeoutException,
			UnableToRenewTokenException, TokenExpiredException, TokenSupersededException, DeviceAttestationRemoteException, UnableToSaveTokenException {
		// there is no 'force refresh' here, token is renewed if it is not already renewed (i.e. the last in the chain).
		try {
			tokenStore.validateLatestStrain(token);

			Lock lock = token.getTokenContext().getLock();

			if (lock.tryLock(timeout, TimeUnit.MILLISECONDS)) {
				try {
					return renewImpl(token, traceId);
				} finally {
					lock.unlock();
				}
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();
			throw new TokenLocalTimeoutException("Interrupted while waiting for attest + activate token", e);
		}
		throw new TokenLocalTimeoutException("Timeout while waiting for attest + activate token");
	}

	private ActivatedToken<T> renewImpl(ActivatedToken<T> token, T traceId) throws DeviceAttestationException, DeviceAttestationRemoteException,
			TokenPropertyStoreException, TokenExpiredException, UnableToRenewTokenException {
		try {
			tokenStore.validateLatestStrain(token);

			Log.d(TAG, "Renew token " + token.getTokenId());

			// the current token is already been renewed
			ActivatedToken<T> latestActivatedToken = token.forward();
			if (latestActivatedToken != token && !latestActivatedToken.hasRenewToken() && !latestActivatedToken.mustBeRenewed()) {
				Log.i(TAG, "Completed renewal of " + token.getTokenId() + " by forwarding to previously renewed active token "
						+ latestActivatedToken.getTokenId());
				return latestActivatedToken;
			}

			if (latestActivatedToken.hasRenewToken()) {
				ActivatedToken<T> completed = completeRenewal(latestActivatedToken, traceId);
				if (completed != null) {
					if (!completed.mustBeRenewed()) {
						return completed;
					}
					latestActivatedToken = completed;
				}
			}
			// renew from scratch
			PendingTokenDetails data = initializeRenewal(latestActivatedToken, traceId); // TODO capture risk level exceptions

			PendingToken<T> pendingToken = tokenStore.createPendingToken(latestActivatedToken, data.getTokenId(), data.getNonce(), traceId);

			latestActivatedToken.setRenewToken(pendingToken);

			return activatePendingTokenImpl(latestActivatedToken);
		} catch (TokenMustBeReplacedRemoteTokenStateException e) {
			Log.i(TAG, "Remote says token must be replaced, discarding.", e);
			tokenStore.clearToken(token.getTokenContext());
			throw new TokenExpiredException(e);
		} catch (RemoteTokenStateException e1) {
			Log.i(TAG, "Remote refused to renew token, discarding.", e1);
			// give up, remote state problem
			throw new UnableToRenewTokenException(e1);
		} catch (TokenException | TokenKeystoreException e) {
			// give up, local problem
			throw new UnableToRenewTokenException(e);
		}
	}

	public void clear(ActivatedToken<T> token) throws TokenLocalTimeoutException, TokenPropertyStoreException {
		try {
			// wait for more than a full timeout
			Log.e(TAG, "Clear token " + token.getTokenId() + ", waiting for lock..");
			Lock lock = token.getTokenContext().getLock();
			if (lock.tryLock(timeout * 2, TimeUnit.MILLISECONDS)) {
				Log.e(TAG, "Clear token");
				try {
					clearImpl(token);
				} finally {
					lock.unlock();
				}
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();

			throw new TokenLocalTimeoutException("Interrupted while waiting for token clear");
		}
		throw new TokenLocalTimeoutException("Timeout while waiting for token clear");
	}

	protected void clearImpl(ActivatedToken<T> token) throws TokenPropertyStoreException {
		tokenStore.clearToken(token);
	}

	private ActivatedToken<T> completeRenewal(ActivatedToken<T> latestActivatedToken, T traceId)
			throws UnableToSaveTokenException, DeviceAttestationException, UnableToPerformCryptoOperationTokenException, RemoteTokenStateException,
			UnableToRenewTokenException, DeviceAttestationRemoteException, TokenCommandException {
		// there is an outstanding renewal on the latest token
		// finish the renewal now
		Log.d(TAG, "Found outstanding renewal on token " + latestActivatedToken.getTokenId() + " with renewal token "
				+ latestActivatedToken.getRenewToken().getTokenId());

		try {
			return activatePendingTokenImpl(latestActivatedToken);
		} catch (TokenNotFoundRemoteTokenStateException e) {
			Log.i(TAG, "Got token not found when trying to activate previously pending renewal token because not found, discarding.");
			tokenStore.clearPendingRenewableToken(latestActivatedToken);
			return null;
		} catch (TokenMustBeReplacedRemoteTokenStateException e) {
			// TODO has been renewed

			Log.i(TAG, "Pending renewal token might be already been activated, attempt getting details");

			try {
				ActivatedToken<T> activatedToken = getTokenDetailsForPendingToken(latestActivatedToken, traceId);
				Log.i(TAG, "Completed renewal by getting got token details");
				return activatedToken;
			} catch (TokenMustBeRenewedRemoteTokenStateException e1) {
				Log.i(TAG, "Unable to get token details, token must be renewed (before we were able to get the certificate and start/stop dates", e1);

				// corner case: do not have certificate or timings of current token
				// convert token to activated token with null certificate and dummy start/stop

				// also saves
				ActivatedToken<T> activatedTokenWithoutCertificate = tokenStore.convertPendingTokenToActiveTokenWhichMustBeRenewed(latestActivatedToken,
						(PendingToken) latestActivatedToken.getRenewToken());

				return activatedTokenWithoutCertificate;
			}
		} catch (RemoteTokenStateException e1) {
			// encoded timestamp could be expired

			// unknown cause
			// might give up already here, but fall through to trying again
			Log.i(TAG, "Unable to activate previously pending renewal token, discarding pending token.");

			// legg til exception
			throw new UnableToRenewTokenException(e1);
		}
	}

	protected PendingTokenDetails initializeRenewal(ActivatedToken<T> token, T traceId)
			throws UnableToPerformCryptoOperationTokenException, DeviceAttestationException, RemoteTokenStateException, DeviceAttestationRemoteException {
		Log.d(TAG, "Initialize renewal of token " + token.getTokenId());

		SecureContainer secureContainerToken;
		try {
			secureContainerToken = token.encodeAsSecureContainer(
					new TokenEncodingRequest(Collections.emptyList(), new TokenAction[] { TokenAction.TOKEN_ACTION_ADD_REMOVE_TOKEN }, false));
		} catch (UnableToIncludeCertificateException e) {
			// should never happen
			throw new RuntimeException(e);
		}

		PendingTokenDetails pendingTokenDetails = remoteTokenService.initiateMobileTokenRenewal(token, secureContainerToken, traceId);

		Log.d(TAG, "Initialized renewal of token " + token.getTokenId() + ", next token is " + pendingTokenDetails.getTokenId());

		return pendingTokenDetails;
	}

	protected ActivatedToken<T> activatePendingTokenImpl(ActivatedToken<T> activatedToken)
			throws RemoteTokenStateException, UnableToSaveTokenException, DeviceAttestationException, DeviceAttestationRemoteException, TokenCommandException {
		PendingToken pendingToken = (PendingToken) activatedToken.getRenewToken();

		Log.d(TAG, "Activate pending token renewal " + pendingToken.getTokenId());

		SecureContainer secureContainerToken;
		try {
			secureContainerToken = activatedToken.encodeAsSecureContainer(
					new TokenEncodingRequest(Collections.emptyList(), new TokenAction[] { TokenAction.TOKEN_ACTION_ADD_REMOVE_TOKEN }, false));
		} catch (UnableToIncludeCertificateException | UnableToPerformCryptoOperationTokenException e) {
			// should never happen
			throw new RuntimeException(e);
		}

		ActiveTokenDetails details = remoteTokenService.completeMobileTokenRenewal(activatedToken, pendingToken, secureContainerToken);

		try {
			Log.d(TAG, "Activated pending token renewal " + pendingToken.getTokenId());
			return tokenStore.convertPendingTokenToActiveToken(activatedToken, pendingToken, details.getSignatureCertificate(), details.getValidityStart(),
					details.getValidityEnd());
		} catch (CertificateException | KeyStoreException | TokenKeystoreException e) {
			throw new UnableToSaveTokenException(e);
		}
	}

	public Clock getClock() {
		return clock;
	}

}
