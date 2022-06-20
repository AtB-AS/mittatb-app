package no.entur.abt.android.bluetooth.format;

/**
 * Parser which strips header and footer, returning base64 data.
 */

public class ChallengePublicKeyParser {

	private static final String HEADER_TAG = "-----BEGIN PUBLIC KEY-----\n";
	private static final String FOOTER_TAG = "-----END PUBLIC KEY-----";

	public static String parsePublicKeyFromEncodedPublicKey(String str) {
		str = str.replace(HEADER_TAG, "");
		str = str.replace(FOOTER_TAG, "");
		str = str.replaceAll("\\s+", "");
		return str;
	}
}
