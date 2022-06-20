package no.entur.abt.android.bluetooth.format;

/**
 *
 * Abstract helper class for version wrapping. Supported range i 0-255.
 *
 */

public abstract class AbstractChallengeBinaryFormat implements ChallengeBinarySerializer, ChallengeBinaryParser {

	protected static final int MAX_VERSION = 255;

	protected static final int VERSION_LENGTH = 1;

	protected final int version;

	protected AbstractChallengeBinaryFormat(int version) {
		this.version = version;
	}

	@Override
	public boolean supports(byte[] buffer) {
		return getVersion(buffer) == version;
	}

	public static int getVersion(byte[] buffer) {
		return buffer[0] & 0xFF;
	}

	protected void writeVersion(byte[] buffer) {
		if (version > MAX_VERSION || version < 0) {
			throw new IllegalStateException("Expected version within  0-" + MAX_VERSION + " minutes, got " + version);
		}
		buffer[0] = (byte) (version & 0xFF);
	}

}
