package no.entur.abt.android.token.core.safetynet;

import android.util.Log;

import java.util.Base64;

import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.json.webtoken.JsonWebSignature;

import no.entur.abt.android.token.attestation.SafetyNetDeviceAttestator;
import no.entur.abt.android.token.core.Check;
import no.entur.abt.android.token.core.Checklist;
import no.entur.abt.android.token.core.exception.DeviceAttestationInvalidFormatException;
import no.entur.abt.core.exchange.grpc.traveller.v1.AndroidSafetyNetAttestation;
import no.entur.abt.core.exchange.grpc.traveller.v1.DeviceAttestationData;

public class SafetyNetDeviceAttestatorChecklistEnricher {

	private static final String LOG_TAG = SafetyNetDeviceAttestatorChecklistEnricher.class.getName();

	private AttestationCertificateVerifier certificateVerifier = new AttestationCertificateVerifier();

	private byte[] serverGeneratedNonce = "SERVER_GENERATED_NONCE".getBytes();
	private byte[] signaturePublicKey = "SIGNATURE_PUBLIC_KEY".getBytes();;
	private byte[] encryptionPublicKey = "ENCRYPTION_PUBLIC_KEY".getBytes();;

	private SafetyNetDeviceAttestator attestator;

	public SafetyNetDeviceAttestatorChecklistEnricher(SafetyNetDeviceAttestator attestator) {
		this.attestator = attestator;
	}

	public void enrich(Checklist report) {
		try {
			AndroidSafetyNetAttestation androidSafetynet = attestator.attest(serverGeneratedNonce, signaturePublicKey, encryptionPublicKey);

			JsonWebSignature jws = parse(androidSafetynet.getJwsResult());

			try {
				certificateVerifier.verifyCertificate(jws);
				report.add(new Check("safetynet.jws.certificate.verify", null, true, null));
			} catch (Exception e) {
				Log.d(LOG_TAG, "Problem verifying certificate", e);
				report.add(new Check("safetynet.jws.certificate.verify", null, false, e));
			}

			AttestationStatement stmt = (AttestationStatement) jws.getPayload();

			byte[] nonce = stmt.getNonce();
			if (nonce != null) {
				report.add(new Check("safetynet.jws.payload.nonce.present", null, true, null));

				DeviceAttestationData deviceAttestationData = DeviceAttestationData.parseFrom(nonce);

				byte[] bytes = deviceAttestationData.getNonce().toByteArray();

				if (equals(bytes, this.serverGeneratedNonce)) {
					report.add(new Check("safetynet.jws.payload.nonce.equal", null, true, null));
				} else {
					report.add(new Check("safetynet.jws.payload.nonce.equal", Base64.getEncoder().encode(nonce), false, null));
				}

			} else {
				report.add(new Check("safetynet.jws.payload.nonce.present", null, false, null));
			}

			if (stmt.hasBasicIntegrity()) {
				report.add(new Check("safetynet.jws.payload.basic-integrity", null, true, null));
			} else {
				report.add(new Check("safetynet.jws.payload.basic-integrity", null, false, null));
			}

			if (stmt.isCtsProfileMatch()) {
				report.add(new Check("safetynet.jws.payload.cts-profile-match", null, true, null));
			} else {
				report.add(new Check("safetynet.jws.payload.cts-profile-match", null, false, null));
			}
		} catch (Exception e) {
			Log.d(LOG_TAG, "Problem generation report", e);
			report.add(new Check("safetynet.general", null, false, e));
		}
	}

	private boolean equals(byte[] bytes, byte[] serverGeneratedNonce) {
		if (bytes.length != serverGeneratedNonce.length) {
			return false;
		}

		for (int i = 0; i < bytes.length; i++) {
			if (bytes[i] != serverGeneratedNonce[i]) {
				return false;
			}
		}
		return true;
	}

	private JsonWebSignature parse(String signedAttestationStatement) throws DeviceAttestationInvalidFormatException {
		try {
			return JsonWebSignature.parser(GsonFactory.getDefaultInstance()).setPayloadClass(AttestationStatement.class).parse(signedAttestationStatement);
		} catch (Exception e) {
			throw new DeviceAttestationInvalidFormatException("Could not parse jws result from safety net attestation", e);
		}
	}
}
