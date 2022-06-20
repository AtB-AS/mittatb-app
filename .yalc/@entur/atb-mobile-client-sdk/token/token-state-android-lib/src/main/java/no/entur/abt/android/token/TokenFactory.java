package no.entur.abt.android.token;

import android.util.Log;

import java.security.KeyStoreException;
import java.security.cert.CertificateException;
import java.time.Clock;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import org.jetbrains.annotations.Nullable;

import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.attestation.DeviceAttestator;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.TokenCommandException;
import no.entur.abt.android.token.exception.TokenException;
import no.entur.abt.android.token.exception.TokenLocalTimeoutException;
import no.entur.abt.android.token.exception.TokenTemporarilyUnavailableException;
import no.entur.abt.android.token.exception.UnableToCreateTokenException;
import no.entur.abt.android.token.exception.UnableToSaveTokenException;
import no.entur.abt.android.token.keystore.TokenKeystoreException;
import no.entur.abt.android.token.remote.ActiveTokenDetails;
import no.entur.abt.android.token.remote.RemoteTokenService;
import no.entur.abt.android.token.remote.exception.TokenNotFoundRemoteTokenStateException;
import no.entur.abt.exchange.pb.common.DeviceAttestationErrorCode;

/**
 *
 * Factory for creation of new tokens. It assumes some of-out-band mechanism was able to obtain a nonce and token id.<br>
 *
 */

public class TokenFactory<T> extends AbstractTokenFactory<T> {

	private static final String TAG = TokenFactory.class.getName();

	public TokenFactory(TokenStore<T> tokenStore, RemoteTokenService<T> channel, DeviceAttestator deviceAttestator, Clock clock, long timeout) {
		super(tokenStore, channel, deviceAttestator, clock, timeout);
	}

	/**
	 * Get the current token, if it is activate or can be activated.
	 *
	 * @return the current token, or null if no current token. The caller must check the token expiry / renew flag to determine whether it must be renewed
	 *         before use.
	 * @throws DeviceAttestationException
	 * @throws TokenTemporarilyUnavailableException
	 */

	public ActivatedToken<T> getToken(TokenContext<T> tokenContext, T traceId)
			throws TokenTemporarilyUnavailableException, DeviceAttestationRemoteException, TokenPropertyStoreException {
		try {
			Log.d(TAG, "Wait for lock..");
			Lock lock = tokenContext.getLock();
			if (lock.tryLock(timeout, TimeUnit.MILLISECONDS)) {
				try {
					Token token = tokenStore.getToken(tokenContext);
					if (token == null) {
						Log.d(TAG, "No current token for token context id " + tokenContext.getId());
						return null;
					}
					if (token instanceof PendingToken) {
						return completePendingNewToken((PendingToken) token);
					} else {
						Log.d(TAG, "Found activated token " + token.getTokenId() + " for token context id " + tokenContext.getId());
						ActivatedToken<T> activatedToken = (ActivatedToken<T>) token;

						return activatedToken.forward();
					}
				} finally {
					lock.unlock();
				}
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();

			throw new TokenLocalTimeoutException("Interrupted while waiting activation of new token", e);
		}
		throw new TokenLocalTimeoutException("Timeout while waiting for activation of new token");
	}

	@Nullable
	protected ActivatedToken<T> completePendingNewToken(PendingToken<T> token) throws DeviceAttestationRemoteException, TokenPropertyStoreException {
		try {
			try {
				return activatePendingNewTokenImpl(token);
			} catch (TokenNotFoundRemoteTokenStateException e) {
				Log.d(TAG, "Got token not found when trying to activate previously pending new token " + token.getTokenId() + ", discarding.");
				tokenStore.clearToken(token.getTokenContext());
				return null;
			}
			// not necessary to include error handling for getting token details (like for renew).
			// Since the activate call is idempotent, it should just return the data we need anyways
		} catch (TokenException e1) {
			Log.i(TAG, "Unable to activate previously pending new token " + token.getTokenId() + ", discarding.", e1);
			// give up, local problem
			tokenStore.clearToken(token.getTokenContext());

			return null;
		}
	}

	/**
	 *
	 * Create, attest and activate token. This creates a new strain.
	 *
	 * @param tokenId token id
	 * @param nonce   nonce
	 * @return token, if successful
	 *
	 */

	public ActivatedToken<T> createNewToken(TokenContext<T> tokenContext, String tokenId, byte[] nonce, T traceId)
			throws DeviceAttestationException, UnableToCreateTokenException, TokenLocalTimeoutException, DeviceAttestationRemoteException {
		try {
			Lock lock = tokenContext.getLock();
			if (lock.tryLock(timeout, TimeUnit.MILLISECONDS)) {
				try {
					// clear any previous token
					clearImpl(tokenContext);

					PendingToken<T> pendingNewToken = tokenStore.createPendingNewToken(tokenContext, tokenId, nonce, traceId);

					// if(true) throw new RuntimeException();
					return activatePendingNewTokenImpl(pendingNewToken);
				} catch (TokenException | TokenKeystoreException e) {
					// give up, local problem
					// defer to caller to clean up
					throw new UnableToCreateTokenException(e);
				} finally {
					lock.unlock();
				}
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();

			throw new TokenLocalTimeoutException(
					"Interrupted while waiting for creating new token " + tokenId + " for token context id " + tokenContext.getId(), e);
		}
		throw new TokenLocalTimeoutException("Timeout while waiting for creating new token " + tokenId + " for token context id " + tokenContext.getId());
	}

	protected ActivatedToken<T> activatePendingNewTokenImpl(PendingToken<T> pendingNewToken)
			throws UnableToSaveTokenException, DeviceAttestationRemoteException, TokenNotFoundRemoteTokenStateException, TokenCommandException {
		Log.d(TAG, "Activate pending new token " + pendingNewToken.getTokenId() + "..");

		ActiveTokenDetails details;
		try {
			details = remoteTokenService.activateNewMobileToken(pendingNewToken);
		} catch (DeviceAttestationRemoteException s) {
			if (s.getCode() == DeviceAttestationErrorCode.DEVICE_ATTESTATION_ERROR_CODE_NONCE_EXPIRED) {
				// handle special case for nonce expired
				throw new TokenNotFoundRemoteTokenStateException();
			}
			throw s;
		}
		try {
			return tokenStore.convertPendingTokenToActiveToken(pendingNewToken, details.getSignatureCertificate(), details.getValidityStart(),
					details.getValidityEnd()); // also saves
		} catch (CertificateException | KeyStoreException | TokenKeystoreException e) {
			throw new UnableToSaveTokenException(e);
		}
	}

	public boolean hasToken(TokenContext<T> tokenContext) throws TokenLocalTimeoutException, TokenPropertyStoreException {
		try {
			// wait for more than a full timeout
			Lock lock = tokenContext.getLock();
			if (lock.tryLock(timeout * 2, TimeUnit.MILLISECONDS)) {
				try {
					return tokenStore.getToken(tokenContext) != null;
				} finally {
					lock.unlock();
				}
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();

			throw new TokenLocalTimeoutException("Interrupted while waiting for token check for token context id " + tokenContext.getId());
		}
		throw new TokenLocalTimeoutException("Timeout while waiting for token check for token context id " + tokenContext.getId());
	}

	public void clear(TokenContext<T> tokenContext) throws TokenLocalTimeoutException, TokenPropertyStoreException {
		try {
			// wait for more than a full timeout
			Log.e(TAG, "Clear all tokens for token context id " + tokenContext.getId() + ", waiting for lock..");
			Lock lock = tokenContext.getLock();
			if (lock.tryLock(timeout * 2, TimeUnit.MILLISECONDS)) {
				Log.e(TAG, "Clear token for token context id " + tokenContext.getId());
				try {
					clearImpl(tokenContext);
				} finally {
					lock.unlock();
				}
			}
		} catch (InterruptedException e) {
			Thread.currentThread().interrupt();

			throw new TokenLocalTimeoutException("Interrupted while waiting for token clear for token context id " + tokenContext.getId());
		}
		throw new TokenLocalTimeoutException("Timeout while waiting for token clear for token context id " + tokenContext.getId());
	}

	protected void clearImpl(TokenContext<T> tokenContext) throws TokenPropertyStoreException {
		tokenStore.clearToken(tokenContext);
	}

	protected void clearAll() throws TokenPropertyStoreException, TokenKeystoreException {
		tokenStore.clearAll();
	}
}
