package no.entur.abt.android.token.attestation;

import com.google.protobuf.GeneratedMessageLite;

import no.entur.abt.android.token.device.DeviceDetailsProvider;
import no.entur.abt.core.exchange.grpc.traveller.v1.DeviceAttestationData;

public class EmulatorDeviceAttestor extends AbstractDeviceAttestor {

	public EmulatorDeviceAttestor(DeviceDetailsProvider deviceDetailsProvider) {
		super(deviceDetailsProvider);
	}

	@Override
	public GeneratedMessageLite attest(byte[] serverGeneratedNonce, byte[] signaturePublicKey, byte[] encryptionPublicKey) {
		DeviceAttestationData attestationData = createAttestationData(serverGeneratedNonce, signaturePublicKey, encryptionPublicKey);
		return createNonceOnlyAttestation(attestationData);
	}

	@Override
	public boolean supportsAttestation() {
		return false;
	}

}
