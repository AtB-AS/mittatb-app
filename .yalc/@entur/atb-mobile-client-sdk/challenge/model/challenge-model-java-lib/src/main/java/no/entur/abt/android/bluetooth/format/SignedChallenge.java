package no.entur.abt.android.bluetooth.format;

public class SignedChallenge {

	protected final int version;
	protected final Challenge challenge;
	protected final byte[] bytes;

	public SignedChallenge(byte[] bytes, Challenge challenge) {
		this(bytes, challenge, AbstractChallengeBinaryFormat.getVersion(bytes));
	}

	public SignedChallenge(byte[] bytes, Challenge challenge, int version) {
		this.bytes = bytes;
		this.challenge = challenge;
		this.version = version;
	}

	public byte[] getBytes() {
		return bytes;
	}

	public Challenge getChallenge() {
		return challenge;
	}

	public String nonceAsText() {
		String signatureHex = toHexString(bytes, bytes.length - 4, 4);
		return challenge.getDelay().toMinutes() + ":" + toHexString(challenge.getNonce()) + "[" + challenge.getClientId() + "] " + signatureHex;
	}

	public int getVersion() {
		return version;
	}

	@Override
	public String toString() {
		return "SignedChallenge{" + "bytes=" + toHexString(bytes) + " (" + bytes.length + ")" + '}';
	}

	/**
	 * Utility metoh to convert a byte array to a hexadecimal string.
	 *
	 * @param data Bytes to convert
	 * @return String, containing hexadecimal representation.
	 */
	public static String toHexString(byte[] data) {
		return toHexString(data, 0, data.length, "%02X");
	}

	/**
	 * Utility method to convert a byte array to a hexadecimal string.
	 *
	 * @param data   Bytes to convert
	 * @param offset offset
	 * @param length length
	 *
	 * @return String, containing hexadecimal representation.
	 */
	public static String toHexString(byte[] data, int offset, int length) {
		return toHexString(data, offset, length, "%02X");
	}

	public static String toHexString(byte[] data, int offset, int length, String format) {
		StringBuilder sb = new StringBuilder();
		if (data != null) {
			for (int i = offset; i < offset + length; i++) {
				sb.append(String.format(format, data[i]));
			}
		}
		return sb.toString();
	}
}
