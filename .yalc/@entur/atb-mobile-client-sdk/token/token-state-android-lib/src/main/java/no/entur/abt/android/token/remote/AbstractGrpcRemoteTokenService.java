package no.entur.abt.android.token.remote;

import android.util.Log;

import java.util.List;

import com.google.protobuf.ByteString;
import com.google.protobuf.MessageLiteOrBuilder;

import no.entur.abt.core.exchange.grpc.traveller.v1.ActivateNewMobileTokenCommand;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidMobileTokenActivationDetails;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;
import no.entur.abt.core.exchange.grpc.traveller.v1.CompleteMobileTokenRenewalCommand;
import no.entur.abt.core.exchange.grpc.traveller.v1.KeyAttestation;
import no.entur.abt.core.exchange.grpc.traveller.v1.MobileTokenActivationDetails;
import no.entur.abt.core.exchange.grpc.traveller.v1.NonceOnlyAttestation;
import no.entur.abt.exchange.pb.common.CommandId;

public abstract class AbstractGrpcRemoteTokenService implements RemoteTokenService<String> {

	private static final String TAG = AbstractGrpcRemoteTokenService.class.getName();

	public CompleteMobileTokenRenewalCommand createCompleteMobileTokenRenewalCommand(String tokenId, String uuid, MessageLiteOrBuilder attestation,
			List<byte[]> signaturePublicKeyCertificateChain, List<byte[]> encryptionPublicKeyCertificateChain) {

		AndroidMobileTokenActivationDetails.Builder androidMobileTokenActivationDetails = AndroidMobileTokenActivationDetails.newBuilder();

		if (attestation instanceof NonceOnlyAttestation) {
			androidMobileTokenActivationDetails.setNonceOnly((NonceOnlyAttestation) attestation);
		} else if (attestation instanceof AndroidSafetyNetAttestation) {
			androidMobileTokenActivationDetails.setSafetynet((AndroidSafetyNetAttestation) attestation);
		}

		if (signaturePublicKeyCertificateChain != null) {
			androidMobileTokenActivationDetails.setSignaturePublicKeyAttestation(buildKeyAttestation(signaturePublicKeyCertificateChain));
		}
		if (encryptionPublicKeyCertificateChain != null) {
			androidMobileTokenActivationDetails.setEncryptionPublicKeyAttestation(buildKeyAttestation(encryptionPublicKeyCertificateChain));
		}

		return CompleteMobileTokenRenewalCommand.newBuilder()
				.setCommandId(CommandId.newBuilder().setId(uuid))
				.setActivationDetails(MobileTokenActivationDetails.newBuilder().setTokenId(tokenId).setAndroid(androidMobileTokenActivationDetails))
				.build();
	}

	protected KeyAttestation buildKeyAttestation(List<byte[]> certificateChain) {
		KeyAttestation.Builder builder = KeyAttestation.newBuilder();
		for (byte[] cert : certificateChain) {
			builder.addCertificateChain(ByteString.copyFrom(cert));
		}

		return builder.build();
	}

	public ActivateNewMobileTokenCommand createActivateNewMobileTokenCommand(String tokenId, String uuid, MessageLiteOrBuilder attestation,
			List<byte[]> signaturePublicKeyCertificateChain, List<byte[]> encryptionPublicKeyCertificateChain) {
		Log.d(TAG, "Activate pending new token");

		AndroidMobileTokenActivationDetails.Builder androidMobileTokenActivationDetails = AndroidMobileTokenActivationDetails.newBuilder();

		if (attestation instanceof NonceOnlyAttestation) {
			androidMobileTokenActivationDetails.setNonceOnly((NonceOnlyAttestation) attestation);
		} else if (attestation instanceof AndroidSafetyNetAttestation) {
			androidMobileTokenActivationDetails.setSafetynet((AndroidSafetyNetAttestation) attestation);
		}

		if (signaturePublicKeyCertificateChain != null) {
			androidMobileTokenActivationDetails.setSignaturePublicKeyAttestation(buildKeyAttestation(signaturePublicKeyCertificateChain));
		}
		if (encryptionPublicKeyCertificateChain != null) {
			androidMobileTokenActivationDetails.setEncryptionPublicKeyAttestation(buildKeyAttestation(encryptionPublicKeyCertificateChain));
		}

		return ActivateNewMobileTokenCommand.newBuilder()
				.setCommandId(CommandId.newBuilder().setId(uuid))
				.setActivationDetails(MobileTokenActivationDetails.newBuilder().setTokenId(tokenId).setAndroid(androidMobileTokenActivationDetails))
				.build();
	}
}
