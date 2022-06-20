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
import no.entur.abt.android.token.exception.TokenLocalTimeoutException;
import no.entur.abt.android.token.exception.UnableToIncludeCertificateException;
import no.entur.abt.android.token.exception.UnableToPerformCryptoOperationTokenException;
import no.entur.abt.android.token.exception.UnableToSaveTokenException;
import no.entur.abt.android.token.keystore.TokenKeystoreException;
import no.entur.abt.android.token.remote.ActiveTokenDetails;
import no.entur.abt.android.token.remote.RemoteTokenService;
import no.entur.abt.android.token.remote.exception.RemoteTokenStateException;
import no.entur.abt.core.exchange.pb.v1.SecureContainer;

import uk.org.netex.www.netex.TokenAction;

public abstract class AbstractTokenFactory<T> {

	private static final String TAG = AbstractTokenFactory.class.getName();

	protected final DeviceAttestator deviceAttestator;
	protected final long timeout;
	protected final RemoteTokenService<T> remoteTokenService;

	protected final Clock clock;
	protected final TokenStore<T> tokenStore;

	public AbstractTokenFactory(TokenStore<T> tokenStore, RemoteTokenService<T> remoteTokenService, DeviceAttestator deviceAttestator, Clock clock,
			long timeout) {
		this.tokenStore = tokenStore;
		this.remoteTokenService = remoteTokenService;
		this.deviceAttestator = deviceAttestator;
		this.clock = clock;
		this.timeout = timeout;
	}

	protected ActivatedToken<T> getTokenDetailsForPendingToken(ActivatedToken<T> activatedToken, T traceId) throws DeviceAttestationException,
			UnableToPerformCryptoOperationTokenException, RemoteTokenStateException, UnableToSaveTokenException, DeviceAttestationRemoteException {

		PendingToken<T> pendingToken = (PendingToken<T>) activatedToken.getRenewToken();

		ActiveTokenDetails activeTokenDetails = getMobileTokenDetails(pendingToken, traceId);

		try {
			return tokenStore.convertPendingTokenToActiveToken(activatedToken, pendingToken, activeTokenDetails.getSignatureCertificate(),
					activeTokenDetails.getValidityStart(), activeTokenDetails.getValidityEnd());
		} catch (CertificateException | KeyStoreException | TokenKeystoreException e) {
			throw new UnableToSaveTokenException(e);
		}
	}

	protected ActiveTokenDetails getMobileTokenDetails(PendingToken<T> pendingToken, T traceId)
			throws UnableToPerformCryptoOperationTokenException, DeviceAttestationException, RemoteTokenStateException, DeviceAttestationRemoteException {

		SecureContainer secureContainerToken;
		try {
			secureContainerToken = pendingToken.encodeAsSecureContainer(
					new TokenEncodingRequest(Collections.emptyList(), new TokenAction[] { TokenAction.TOKEN_ACTION_ADD_REMOVE_TOKEN }, false));
		} catch (UnableToIncludeCertificateException e) {
			// should never happen
			throw new RuntimeException(e);
		}

		return remoteTokenService.getMobileTokenDetails(pendingToken, secureContainerToken, traceId);
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

}
