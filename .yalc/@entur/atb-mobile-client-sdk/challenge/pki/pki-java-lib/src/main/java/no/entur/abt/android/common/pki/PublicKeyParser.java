package no.entur.abt.android.common.pki;

import java.nio.charset.StandardCharsets;

import com.google.common.io.BaseEncoding;

/**
 * Parser which strips header and footer, base64 decodes.
 */

public class PublicKeyParser {

	// TODO this code is duplicated by ChallengePublicKeyParser

	private static final String HEADER_TAG = "-----BEGIN PUBLIC KEY-----\n";
	private static final String FOOTER_TAG = "-----END PUBLIC KEY-----";

	public static byte[] parsePublicKeyFromEncodedPublicKey(byte[] buffer) {
		String str = new String(buffer, StandardCharsets.US_ASCII);
		str = str.replace(HEADER_TAG, "");
		str = str.replace(FOOTER_TAG, "");
		str = str.replaceAll("\\s+", "");
		return decodeBase64(str);
	}

	public static byte[] decodeBase64(String base64String) {
		if (base64String == null) {
			return null;
		} else {
			try {
				return BaseEncoding.base64().decode(base64String);
			} catch (IllegalArgumentException var2) {
				if (var2.getCause() instanceof BaseEncoding.DecodingException) {
					return BaseEncoding.base64().decode(base64String.trim());
				} else {
					throw var2;
				}
			}
		}
	}

	private PublicKeyParser() {
	}
}
