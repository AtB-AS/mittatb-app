package no.entur.abt.android.token.attestation;

import com.google.protobuf.ByteString;

import no.entur.abt.android.token.device.DeviceDetailsProvider;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;
import no.entur.abt.core.exchange.grpc.traveller.v1.DeviceAttestationData;
import no.entur.abt.core.exchange.grpc.traveller.v1.NonceOnlyAttestation;

public abstract class AbstractDeviceAttestor implements DeviceAttestator {

	protected final DeviceDetailsProvider deviceDetailsProvider;

	public AbstractDeviceAttestor(DeviceDetailsProvider deviceDetailsProvider) {
		this.deviceDetailsProvider = deviceDetailsProvider;
	}

	protected AndroidSafetyNetAttestation createAndroidAttestation(String jwsResult) {
		return AndroidSafetyNetAttestation.newBuilder().setJwsResult(jwsResult).build();
	}

	protected NonceOnlyAttestation createNonceOnlyAttestation(DeviceAttestationData attestationData) {
		return NonceOnlyAttestation.newBuilder().setDeviceAttestationData(attestationData).build();
	}

	protected DeviceAttestationData createAttestationData(byte[] receivedNonce, byte[] publicKeyBytes, byte[] encryptionPublicKeyBytes) {
		DeviceAttestationData.Builder builder = DeviceAttestationData.newBuilder();
		builder.setNonce(ByteString.copyFrom(receivedNonce));
		builder.setSignaturePublicKey(ByteString.copyFrom(publicKeyBytes));
		builder.setEncryptionPublicKey(ByteString.copyFrom(encryptionPublicKeyBytes));
		builder.addAllDeviceInfo(deviceDetailsProvider.getDeviceInfo());

		return builder.build();
	}

}
