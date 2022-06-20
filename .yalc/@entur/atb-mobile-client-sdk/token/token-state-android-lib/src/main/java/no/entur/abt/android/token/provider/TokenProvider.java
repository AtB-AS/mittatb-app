package no.entur.abt.android.token.provider;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.TokenContext;
import no.entur.abt.android.token.TokenRenewer;
import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.TokenStateException;

/**
 * Helper interface for operation of {@linkplain ActivatedToken}.
 * 
 */

public interface TokenProvider<T> extends TokenRenewer<T> {

	ActivatedToken<T> getToken(TokenContext<T> tokenContext, T traceId)
			throws TokenStateException, DeviceAttestationException, DeviceAttestationRemoteException;

	void close();

}
