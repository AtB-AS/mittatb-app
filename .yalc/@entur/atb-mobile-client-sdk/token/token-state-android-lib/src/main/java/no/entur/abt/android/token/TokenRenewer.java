package no.entur.abt.android.token;

import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.TokenLocalTimeoutException;
import no.entur.abt.android.token.exception.TokenStateException;

/**
 *
 * Interface for renewing (activated) tokens.
 *
 */

public interface TokenRenewer<T> {

	/**
	 *
	 * Complete any outstanding renewal, and/or create a new renewal and complete it.
	 *
	 * @param token   token to renew
	 * @param traceId tracking token (i.e. correlation id)
	 * @return a renewed token
	 * @throws TokenStateException        if there was a problem renewing the token
	 * @throws DeviceAttestationException if there was a problem attestating the device
	 */

	ActivatedToken<T> renew(ActivatedToken<T> token, T traceId) throws TokenStateException, DeviceAttestationException, DeviceAttestationRemoteException;

	void clear(ActivatedToken<T> token) throws TokenLocalTimeoutException, TokenPropertyStoreException;

}
