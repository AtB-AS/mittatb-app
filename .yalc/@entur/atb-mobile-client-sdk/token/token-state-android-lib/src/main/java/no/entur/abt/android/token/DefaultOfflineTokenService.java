package no.entur.abt.android.token;

import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.NoTokenException;
import no.entur.abt.android.token.exception.TokenLocalTimeoutException;
import no.entur.abt.android.token.exception.TokenStateException;
import no.entur.abt.android.token.keystore.TokenKeystoreException;
import no.entur.abt.android.token.remote.exception.TokenMustBeRenewedRemoteTokenStateException;

public class DefaultOfflineTokenService<T> implements TokenService<T> {

	protected final TokenFactory<T> tokenFactory;
	protected final TokenContexts tokenContexts;

	public DefaultOfflineTokenService(TokenFactory<T> tokenFactory, TokenContexts tokenContexts) {
		this.tokenFactory = tokenFactory;
		this.tokenContexts = tokenContexts;
	}

	public void clearToken(String tokenContextId) throws TokenLocalTimeoutException, TokenPropertyStoreException {
		TokenContext tokenContext = tokenContexts.get(tokenContextId);
		if (tokenContext == null) {
			throw new IllegalStateException("Unknown context " + tokenContextId);
		}
		tokenFactory.clear(tokenContext);
	}

	@Override
	public ActivatedToken<T> createToken(String tokenContextId, String tokenId, byte[] nonce, T traceId) {
		throw new IllegalStateException("Cannot create token when offline");
	}

	@Override
	public TokenService<T> toOfflineTokenService() {
		return this;
	}

	public ActivatedToken<T> getToken(String tokenContextId, T traceId) throws TokenStateException, DeviceAttestationRemoteException {
		TokenContext tokenContext = tokenContexts.get(tokenContextId);
		if (tokenContext == null) {
			throw new IllegalStateException("Unknown context " + tokenContextId);
		}

		ActivatedToken<T> token = tokenFactory.getToken(tokenContext, traceId);
		if (token != null) {
			if (!token.isEnded()) {
				return token;
			}
			throw renewException();
		}
		throw missingException();
	}

	protected TokenStateException missingException() {
		return new NoTokenException();
	}

	protected TokenMustBeRenewedRemoteTokenStateException renewException() {
		return new TokenMustBeRenewedRemoteTokenStateException();
	}

	@Override
	public void clearTokens() throws TokenKeystoreException, TokenPropertyStoreException {
		tokenFactory.clearAll();
		tokenContexts.clearAllTokens();
	}

}
