package no.entur.abt.android.token;

import androidx.annotation.NonNull;

import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.TokenException;
import no.entur.abt.android.token.keystore.TokenKeystoreException;
import no.entur.abt.android.token.provider.TokenProvider;

public class DefaultTokenService<T> implements TokenService<T> {

	public static final int BUCKET_SIZE_SECONDS = 30;

	protected final TokenProvider<T> tokenProvider;
	protected final TokenFactory<T> tokenFactory;
	protected final TokenContexts tokenContexts;

	public DefaultTokenService(TokenFactory<T> tokenFactory, TokenProvider<T> tokenProvider, TokenContexts tokenContexts) {
		this.tokenFactory = tokenFactory;
		this.tokenProvider = tokenProvider;
		this.tokenContexts = tokenContexts;
	}

	public ActivatedToken<T> getToken(String tokenContextId, T traceId) throws TokenException, DeviceAttestationException, DeviceAttestationRemoteException {
		TokenContext tokenContext = getTokenContextOrThrowException(tokenContextId);
		return tokenProvider.getToken(tokenContext, traceId);
	}

	@NonNull
	private TokenContext getTokenContextOrThrowException(String tokenContextId) {
		TokenContext tokenContext = tokenContexts.get(tokenContextId);
		if (tokenContext == null) {
			throw new IllegalStateException("Unknown token context " + tokenContextId);
		}
		return tokenContext;
	}

	@Override
	public void clearToken(String tokenContextId) throws TokenException {
		TokenContext tokenContext = getTokenContextOrThrowException(tokenContextId);

		tokenFactory.clear(tokenContext);
	}

	@Override
	public ActivatedToken<T> createToken(String tokenContextId, String tokenId, byte[] nonce, T traceId)
			throws TokenException, DeviceAttestationException, DeviceAttestationRemoteException {
		TokenContext tokenContext = getTokenContextOrThrowException(tokenContextId);
		return tokenFactory.createNewToken(tokenContext, tokenId, nonce, traceId);
	}

	@Override
	public TokenService<T> toOfflineTokenService() {
		return new DefaultOfflineTokenService<T>(tokenFactory, tokenContexts);
	}

	@Override
	public void clearTokens() throws TokenKeystoreException, TokenPropertyStoreException {
		tokenFactory.clearAll();
		tokenContexts.clearAllTokens();
	}

}
