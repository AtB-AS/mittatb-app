package no.entur.abt.android.token;

import android.util.Log;

import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.Provider;
import java.security.Signature;
import java.security.SignatureException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.time.Clock;
import java.time.Instant;
import java.util.Collection;

import com.google.protobuf.ByteString;
import com.google.protobuf.Timestamp;

import no.entur.abt.android.token.device.DeviceDetailsProvider;
import no.entur.abt.android.token.exception.UnableToIncludeCertificateException;
import no.entur.abt.android.token.exception.UnableToPerformCryptoOperationTokenException;
import no.entur.abt.core.exchange.pb.v1.DeviceDetails;
import no.entur.abt.core.exchange.pb.v1.MobileIDTokenPayload;
import no.entur.abt.core.exchange.pb.v1.SecureContainer;
import no.entur.abt.core.exchange.pb.v1.SignatureType;
import no.entur.abt.core.exchange.pb.v1.SignedPayload;
import no.entur.abt.core.exchange.pb.v1.SignedPayloads;

import uk.org.netex.www.netex.TokenAction;

/**
 * Helper class for encoding/signing.
 */

public class TokenEncoder {

	private static final String TAG = TokenEncoder.class.getName();

	protected static final String TOKEN_SIGNATURE_ALGORITHM = "SHA256withECDSA";

	protected final Clock clock;
	protected final DeviceDetailsProvider deviceDetailsProvider;
	protected final Provider provider;

	public TokenEncoder(Clock clock, DeviceDetailsProvider deviceDetailsProvider) {
		this(clock, deviceDetailsProvider, null);
	}

	public TokenEncoder(Clock clock, DeviceDetailsProvider deviceDetailsProvider, Provider provider) {
		this.clock = clock;
		this.deviceDetailsProvider = deviceDetailsProvider;
		this.provider = provider;
	}

	public SecureContainer encodeAsSecureContainer(TokenEncodingRequest tokenEncodingRequest, Token token)
			throws UnableToPerformCryptoOperationTokenException, UnableToIncludeCertificateException {
		return encodeAndSignToken(tokenEncodingRequest.getChallenges(), tokenEncodingRequest.getTokenActions(), tokenEncodingRequest.isIncludeCertificate(),
				token);
	}

	protected SecureContainer encodeAndSignToken(Collection<byte[]> challengeNonces, TokenAction[] tokenActions, boolean includeCertificate, Token token)
			throws UnableToPerformCryptoOperationTokenException, UnableToIncludeCertificateException {
		DeviceDetails deviceDetails = deviceDetailsProvider.getDeviceDetails();
		try {
			Instant n = clock.instant();

			Timestamp timestamp = Timestamp.newBuilder().setSeconds(n.getEpochSecond()).setNanos(n.getNano()).build();

			MobileIDTokenPayload.Builder tokenPayloadBuilder = MobileIDTokenPayload.newBuilder().setTokenId(token.getTokenId()).setDeviceTimestamp(timestamp);

			for (TokenAction action : tokenActions) {
				tokenPayloadBuilder.addActions(action);
			}

			for (byte[] challengeNonce : challengeNonces) {
				tokenPayloadBuilder.addReceivedNonces(ByteString.copyFrom(challengeNonce));
			}

			if (deviceDetails != null) {
				tokenPayloadBuilder.setDeviceDetails(deviceDetails);
			}

			ByteString payload = SignedPayloads.newBuilder()
					.addSignedPayloads(SignedPayload.newBuilder().setMobileIdTokenPayload(tokenPayloadBuilder))
					.build()
					.toByteString();
			no.entur.abt.core.exchange.pb.v1.Signature.Builder signatureBuilder = no.entur.abt.core.exchange.pb.v1.Signature.newBuilder()
					.setAlgorithm(TOKEN_SIGNATURE_ALGORITHM)
					.setIssuer("N")
					.setTimestamp(timestamp)
					.setSignature(sign(token.getSignatureKey().getPrivate(), payload));

			if (includeCertificate) {
				if (token instanceof ActivatedToken) {
					ActivatedToken<?> t = (ActivatedToken<?>) token;
					Certificate certificate = t.getSignatureCertificate();
					signatureBuilder.setCertificate(ByteString.copyFrom(certificate.getEncoded()));
				} else {
					throw new UnableToIncludeCertificateException();
				}
			}
			signatureBuilder.setType(SignatureType.SIGNATURE_TYPE_SHA256_WITH_ECDSA);

			return SecureContainer.newBuilder().setSignature(signatureBuilder).setSignedPayloads(payload).build();
		} catch (NoSuchAlgorithmException | InvalidKeyException | SignatureException | CertificateException e) {
			Log.e(TAG, "Error creating token", e);

			throw new UnableToPerformCryptoOperationTokenException("Error creating token", e);
		}
	}

	protected ByteString sign(PrivateKey privateKey, ByteString bytes) throws NoSuchAlgorithmException, SignatureException, InvalidKeyException {
		Signature signature;
		if (provider != null) {
			signature = java.security.Signature.getInstance(TOKEN_SIGNATURE_ALGORITHM, provider);
		} else {
			signature = java.security.Signature.getInstance(TOKEN_SIGNATURE_ALGORITHM);
		}
		signature.initSign(privateKey);
		signature.update(bytes.toByteArray());

		return ByteString.copyFrom(signature.sign());
	}

}
