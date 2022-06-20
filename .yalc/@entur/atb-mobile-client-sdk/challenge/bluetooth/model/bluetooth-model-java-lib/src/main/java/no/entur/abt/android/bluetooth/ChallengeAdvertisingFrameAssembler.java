package no.entur.abt.android.bluetooth;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameGroupHeader;
import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeader;
import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeaderBinaryFormat;

public class ChallengeAdvertisingFrameAssembler {

	private static final String TAG = ChallengeAdvertisingFrameAssembler.class.getName();

	private static ChallengeAdvertisingFrameBinaryFormat FORMAT = new ChallengeAdvertisingFrameBinaryFormat();

	// implementation note:
	// use an array to cache each group, so that new frames always overwrite the old frames
	// i.e. not a set type construction where the same header with different payload exists
	// within the same cache

	private Map<ChallengeAdvertisingFrameGroupHeader, ChallengeAdvertisingFrame[]> framesByGroup = new ConcurrentHashMap<>();

	public byte[] addFrame(ChallengeAdvertisingFrame newFrame) {
		ChallengeAdvertisingFrameHeader h = newFrame.getHeader();
		ChallengeAdvertisingFrameGroupHeader newFrameKey = new ChallengeAdvertisingFrameGroupHeader(h);
		ChallengeAdvertisingFrame[] framesForNonceKey = framesByGroup.computeIfAbsent(newFrameKey,
				e -> new ChallengeAdvertisingFrame[ChallengeAdvertisingFrameHeaderBinaryFormat.MAX_FRAMES]);
		int completeCount = getCompleteCount(framesForNonceKey);
		if (completeCount != -1) {
			return null;
		}

		// make sure we only accept frames which are within the last frame's frame number
		// i.e. discarding too high frame numbers when a new last frame is added,
		// discarding too high frame numbers when a last frame exists,
		// discarding old last frames when a new last frame is added

		if (newFrame.getHeader().isLast()) {
			// discard other frames which are last
			int newLastFrameNumber = newFrame.getHeader().getFrameNumber();
			for (int i = 0; i < newLastFrameNumber; i++) {
				if (framesForNonceKey[i] != null) {
					ChallengeAdvertisingFrameHeader oldHeader = framesForNonceKey[i].getHeader();
					if (oldHeader.isLast()) {
						framesForNonceKey[i] = null;
					}
				}
			}

			// clear any frame above the new last frame
			for (int i = newLastFrameNumber + 1; i < framesForNonceKey.length; i++) {
				framesForNonceKey[i] = null;
			}
		} else {
			// if we already have the last frame, check that the new frame is within the right range
			// note: it is possible here that the new frame overwrites the previous last frame
			int last = getLastFrameIndex(framesForNonceKey);
			if (last != -1 && newFrame.getHeader().getFrameNumber() > last) {
				// discard the new frame
				return null;
			}
		}
		framesForNonceKey[newFrame.getHeader().getFrameNumber()] = newFrame;

		completeCount = getCompleteCount(framesForNonceKey);
		if (completeCount != -1) {
			return FORMAT.toPayload(framesForNonceKey, completeCount);
		}
		return null;
	}

	public static int getCompleteCount(ChallengeAdvertisingFrame[] framesForNonceKey) {
		for (int i = 0; i < framesForNonceKey.length; i++) {
			if (framesForNonceKey[i] == null) {
				return -1;
			}
			if (framesForNonceKey[i].getHeader().isLast()) {
				return i + 1;
			}
		}
		return -1;
	}

	public static int getLastFrameIndex(ChallengeAdvertisingFrame[] framesForNonceKey) {
		for (int i = 0; i < framesForNonceKey.length; i++) {
			if (framesForNonceKey[i] != null && framesForNonceKey[i].getHeader().isLast()) {
				return i;
			}
		}
		return -1;
	}

	public void clear() {
		framesByGroup.clear();
	}

}
