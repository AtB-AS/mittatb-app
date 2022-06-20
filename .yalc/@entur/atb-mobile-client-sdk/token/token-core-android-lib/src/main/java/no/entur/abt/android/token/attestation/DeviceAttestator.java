package no.entur.abt.android.token.attestation;

import com.google.protobuf.GeneratedMessageLite;

/**
 * Create device attestations.
 */
public interface DeviceAttestator {

	/**
	 * Create attestation of device with serverGeneratedNonce from server.
	 * 
	 * @param serverGeneratedNonce a short lived secret from the server
	 * @param signaturePublicKey   the public signature key to attest
	 * @param encryptionPublicKey  the public encryption key to attest
	 * @return
	 */
	GeneratedMessageLite attest(byte[] serverGeneratedNonce, byte[] signaturePublicKey, byte[] encryptionPublicKey) throws DeviceAttestationException;

	/**
	 * Attestation check
	 *
	 * @return true if (real) device attestation works. So typically false for an emulator.
	 */

	boolean supportsAttestation();

}
