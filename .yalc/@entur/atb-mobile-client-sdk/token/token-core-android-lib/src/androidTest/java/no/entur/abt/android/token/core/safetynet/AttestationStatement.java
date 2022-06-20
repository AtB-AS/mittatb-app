package no.entur.abt.android.token.core.safetynet;

import android.util.Base64;

import com.google.api.client.json.webtoken.JsonWebSignature;
import com.google.api.client.util.Key;

public class AttestationStatement extends JsonWebSignature.Payload {

	@Key
	private String nonce;
	@Key
	private long timestampMs;

	@Key
	private String apkPackageName;

	@Key
	private String[] apkCertificateDigestSha256;

	@Key
	private String apkDigestSha256;

	@Key
	private boolean ctsProfileMatch;

	@Key
	private boolean basicIntegrity;

	@Key
	private String advice;

	public byte[] getNonce() {
		return Base64.decode(nonce, Base64.DEFAULT);
	}

	public long getTimestampMs() {
		return timestampMs;
	}

	public String getApkPackageName() {
		return apkPackageName;
	}

	public boolean isCtsProfileMatch() {
		return ctsProfileMatch;
	}

	public boolean hasBasicIntegrity() {
		return basicIntegrity;
	}

	public String getAdvice() {
		return advice;
	}
}
