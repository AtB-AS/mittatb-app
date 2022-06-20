package no.entur.abt.android.token;

import android.util.Log;

import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;

import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.TokenLocalTimeoutException;
import no.entur.abt.android.token.exception.TokenRenewerNotReadyException;
import no.entur.abt.android.token.exception.TokenStateException;

/**
 * offline token renewer. Primarily intended as a placeholder until a full token-renewer is available.
 * 
 * @param <T>
 */

public class OfflineTokenRenewer<T> implements TokenRenewer<T> {

	private static final String TAG = OfflineTokenRenewer.class.getName();

	protected final TokenStore<T> tokenStore;
	protected final long timeout;

	public OfflineTokenRenewer(TokenStore<T> tokenStore, long timeout) {
		this.tokenStore = tokenStore;
		this.timeout = timeout;
	}

	@Override
	public ActivatedToken<T> renew(ActivatedToken<T> token, T traceId)
			throws TokenStateException, DeviceAttestationException, DeviceAttestationRemoteException {
		// this method should never be invoked, since renewing is not an option before wiring a full
		// token renewer.
		throw new TokenRenewerNotReadyException();
	}

	@Override
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
