package no.entur.abt.android.token;

import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.TokenException;
import no.entur.abt.android.token.keystore.TokenKeystoreException;

public interface TokenService<T> {

	ActivatedToken<T> getToken(String tokenContextId, T traceId) throws TokenException, DeviceAttestationException, DeviceAttestationRemoteException;

	void clearToken(String tokenContextId) throws TokenException;

	void clearTokens() throws TokenKeystoreException, TokenPropertyStoreException;

	/**
	 * Activate a token for the current customer account.
	 *
	 * @param tokenContextId the context to which the token belongs
	 * @param tokenId        id of the token that is to be activated
	 * @param nonce          short lived secret from server used to authorize token activation
	 * @param traceId        trace id (i.e. correlation id)
	 * @return
	 */

	ActivatedToken<T> createToken(String tokenContextId, String tokenId, byte[] nonce, T traceId)
			throws TokenException, DeviceAttestationException, DeviceAttestationRemoteException;

	TokenService<T> toOfflineTokenService();

}
