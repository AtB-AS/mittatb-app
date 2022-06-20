package no.entur.abt.android.bluetooth;

import java.util.Arrays;
import java.util.zip.CRC32;

/**
 *
 * Very simple filter for frames. This filter is not intended to be accurate, but rather relies on hash statistics to filter 'most of the frames' seen before.
 *
 */

public class ChallengeAdvertisingFrameFilter {

	private static final int SIZE = 128;

	private byte[][] frames = new byte[SIZE][];

	private final CRC32 checksum = new CRC32();

	public boolean hasFrame(byte[] frame) {
		if (frame.length <= 4) {
			return false;
		}
		int index = getIndex(frame);
		byte[] previous = frames[index];
		if (Arrays.equals(previous, frame)) { // accepts null
			return true;
		}
		frames[index] = frame;
		return false;
	}

	protected int getIndex(byte[] frame) {
		try {
			checksum.update(frame);
			return Math.abs((int) checksum.getValue()) % SIZE;
		} finally {
			checksum.reset();
		}
	}

	public void clear() {
		frames = new byte[SIZE][];
	}

}
