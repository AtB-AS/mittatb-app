package no.entur.abt.android.token.provider;

import android.util.Log;

import java.time.temporal.ChronoUnit;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.TokenContext;
import no.entur.abt.android.token.TokenFactory;
import no.entur.abt.android.token.TokenPropertyStoreException;
import no.entur.abt.android.token.TokenRenewer;
import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.NoTokenException;
import no.entur.abt.android.token.exception.TokenLocalTimeoutException;
import no.entur.abt.android.token.exception.TokenStateException;

public class RenewingTokenProvider<T> implements TokenProvider<T> {

	private static final String TAG = RenewingTokenProvider.class.getName();

	private final TokenFactory<T> tokenFactory;

	private final long minimumTimeToLive;

	private TokenRenewer<T> tokenRenewer;

	public RenewingTokenProvider(TokenFactory<T> tokenFactory, long minimumTimeToLive, TokenRenewer<T> tokenRenewer) {
		this.tokenFactory = tokenFactory;
		this.minimumTimeToLive = minimumTimeToLive;
		this.tokenRenewer = tokenRenewer;
	}

	public ActivatedToken<T> renew(ActivatedToken<T> token, T traceId)
			throws TokenStateException, DeviceAttestationException, DeviceAttestationRemoteException {
		Log.d(TAG, "Renew token");

		if (token.isEnded() || token.willEndInLessThan(minimumTimeToLive, ChronoUnit.MILLIS)) {
			token.markMustBeRenewed();
		}

		return tokenRenewer.renew(token, traceId);
	}

	@Override
	public ActivatedToken<T> getToken(TokenContext<T> tokenContext, T traceId)
			throws TokenStateException, DeviceAttestationException, DeviceAttestationRemoteException {
		ActivatedToken<T> token = tokenFactory.getToken(tokenContext, traceId);
		if (token == null) {
			throw new NoTokenException("No token for context '" + tokenContext.getId() + "'");
		}

		if (token.isEnded() || token.willEndInLessThan(minimumTimeToLive, ChronoUnit.MILLIS)) {
			token.markMustBeRenewed();
		}

		if (token.mustBeRenewed() || token.getRenewToken() != null) {
			Log.d(TAG, "Renew token for context '" + tokenContext.getId() + "'");
			return tokenRenewer.renew(token, traceId);
		}

		return token;
	}

	@Override
	public void clear(ActivatedToken<T> token) throws TokenLocalTimeoutException, TokenPropertyStoreException {
		tokenFactory.clear(token);
	}

	@Override
	public void close() {
		// noop
	}

}
