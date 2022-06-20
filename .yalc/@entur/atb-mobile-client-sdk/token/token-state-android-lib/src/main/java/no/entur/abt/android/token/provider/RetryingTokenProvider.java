package no.entur.abt.android.token.provider;

import android.util.Log;

import io.grpc.StatusRuntimeException;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.TokenContext;
import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.TokenStateException;

/**
 * This provider implements a workaround for transient network problems. <br>
 * <br>
 * It retries getting the {@linkplain ActivatedToken} if the wrapped provider throws a {@linkplain StatusRuntimeException} with
 * {@linkplain io.grpc.Status.Code#UNAVAILABLE} state.
 */

public class RetryingTokenProvider<T> extends BaseTokenProvider<T> {

	private static final String TAG = RetryingTokenProvider.class.getName();

	public RetryingTokenProvider(TokenProvider<T> provider) {
		super(provider);
	}

	@Override
	public ActivatedToken<T> getToken(TokenContext<T> context, T traceId)
			throws TokenStateException, DeviceAttestationException, DeviceAttestationRemoteException {
		try {
			return provider.getToken(context, traceId);
		} catch (StatusRuntimeException s) {
			if (s.getStatus().getCode() == io.grpc.Status.Code.UNAVAILABLE) {
				Log.d(TAG, "Got " + s.getStatus() + ", retrying once");
				// assume transient network issue, retry once
				return provider.getToken(context, traceId);
			}
			throw s;
		}
	}

	@Override
	public ActivatedToken<T> renew(ActivatedToken<T> token, T traceId)
			throws TokenStateException, DeviceAttestationException, DeviceAttestationRemoteException {
		try {
			return provider.renew(token, traceId);
		} catch (StatusRuntimeException s) {
			if (s.getStatus().getCode() == io.grpc.Status.Code.UNAVAILABLE) {
				Log.d(TAG, "Got " + s.getStatus() + ", retrying once");
				// assume transient network issue, retry once
				return provider.renew(token, traceId);
			}
			throw s;
		}
	}
}
