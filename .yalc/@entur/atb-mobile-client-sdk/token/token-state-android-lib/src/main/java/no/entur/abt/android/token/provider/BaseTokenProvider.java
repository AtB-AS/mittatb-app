package no.entur.abt.android.token.provider;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.TokenPropertyStoreException;
import no.entur.abt.android.token.exception.TokenLocalTimeoutException;

public abstract class BaseTokenProvider<T> implements TokenProvider<T> {

	protected final TokenProvider<T> provider;

	public BaseTokenProvider(TokenProvider<T> provider) {
		this.provider = provider;
	}

	public TokenProvider<T> getProvider() {
		return provider;
	}

	@Override
	public void clear(ActivatedToken<T> token) throws TokenLocalTimeoutException, TokenPropertyStoreException {
		provider.clear(token);
	}

	@Override
	public void close() {
		provider.close();
	}

}
