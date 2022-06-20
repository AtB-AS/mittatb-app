package no.entur.abt.android.bluetooth.format;

import java.util.Arrays;

/**
 *
 * Very simple filter for frames. This filter is not intended to be accurate, but rather relies on hash statistics to filter 'most of the frames' seen before.
 *
 */

public class ChallengeAdvertisingFrameFilter {

	private static final int SIZE = 128;

	private byte[][] frames = new byte[SIZE][];

	public boolean hasFrame(byte[] frame) {
		if (frame.length <= 4) {
			return false;
		}
		int hash = Math.abs(frame[0] ^ frame[1] ^ frame[2] ^ frame[3]) % SIZE;
		byte[] previous = frames[hash];
		if (Arrays.equals(previous, frame)) { // accepts null
			return true;
		}
		frames[hash] = frame;
		return false;
	}

	public void clear() {
		frames = new byte[SIZE][];
	}

}
