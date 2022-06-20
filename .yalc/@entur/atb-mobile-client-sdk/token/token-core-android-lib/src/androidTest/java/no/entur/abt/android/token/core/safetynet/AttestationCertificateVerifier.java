package no.entur.abt.android.token.core.safetynet;

import java.security.cert.X509Certificate;

import org.apache.http.conn.ssl.DefaultHostnameVerifier;

import com.google.api.client.json.webtoken.JsonWebSignature;

import no.entur.abt.android.token.core.exception.DeviceAttestationSignatureException;

public class AttestationCertificateVerifier {

	private String androidAttestationHostname = "attest.android.com";

	private static final DefaultHostnameVerifier HOSTNAME_VERIFIER = new DefaultHostnameVerifier();

	public void verifyCertificate(JsonWebSignature jws) throws DeviceAttestationSignatureException {
		// Verify the signature of the JWS and retrieve the signature certificate.
		boolean verified;
		try {
			verified = extracted(jws);
		} catch (Exception e) {
			throw new DeviceAttestationSignatureException("Safetynet JWS verification failed", e);
		}
		if (!verified) {
			throw new DeviceAttestationSignatureException("Safetynet JWS not verified");
		}
	}

	private boolean extracted(JsonWebSignature jws) throws Exception {
		X509Certificate cert = jws.verifySignature();
		if (cert != null) {
			HOSTNAME_VERIFIER.verify(androidAttestationHostname, cert);

			return true;
		}
		return false;
	}

}
