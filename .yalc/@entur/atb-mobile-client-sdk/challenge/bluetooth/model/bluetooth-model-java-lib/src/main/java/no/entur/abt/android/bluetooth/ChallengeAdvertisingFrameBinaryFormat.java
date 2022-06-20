package no.entur.abt.android.bluetooth;

import java.util.ArrayList;
import java.util.List;

import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeader;
import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeaderBinaryFormat;

public class ChallengeAdvertisingFrameBinaryFormat {

	public static final int MAX_FRAME_PAYLOAD_LENGTH = 23;
	public static final int CORRELATION_ID_MAXVALUE = 255;

	protected static ChallengeAdvertisingFrameHeaderBinaryFormat HEADER_FORMAT = new ChallengeAdvertisingFrameHeaderBinaryFormat();

	// Legacy bluetooth Advertising Packet max size is 31
	// 2 bytes for Type fields
	// 2 bytes for Company Identifier Code
	// leaving 27 for header + payload

	public static ChallengeAdvertisingFrame parse(byte[] buffer) {
		int headerLength = HEADER_FORMAT.getLength();

		if (buffer == null || buffer.length <= headerLength) {
			throw new IllegalArgumentException("Expected size > " + headerLength);
		}
		if (buffer.length > headerLength + MAX_FRAME_PAYLOAD_LENGTH) {
			throw new IllegalArgumentException("Expected header + payload to be " + (headerLength + MAX_FRAME_PAYLOAD_LENGTH) + " bytes or less");
		}
		ChallengeAdvertisingFrameHeader header = HEADER_FORMAT.parse(buffer);

		return new ChallengeAdvertisingFrame(buffer, header);
	}

	protected static ChallengeAdvertisingFrame newInstance(byte[] payload, int clientId, int frameNumber, boolean lastFrame, int correlationId, int channel) {
		ChallengeAdvertisingFrameHeader header = new ChallengeAdvertisingFrameHeader(clientId, frameNumber, lastFrame, correlationId, channel);

		byte[] buffer = new byte[payload.length + HEADER_FORMAT.getLength()];
		HEADER_FORMAT.serialize(buffer, header);
		System.arraycopy(payload, 0, buffer, HEADER_FORMAT.getLength(), payload.length);

		return new ChallengeAdvertisingFrame(buffer, header);
	}

	/**
	 *
	 * Parse with some sanity checking
	 *
	 * @param content bytes to parse
	 * @return a frame, or null if checks did not pass
	 */

	public static ChallengeAdvertisingFrame parseOrNull(byte[] content) {
		if (isValid(content)) {
			return parse(content);
		} else {
			return null;
		}
	}

	public static boolean isValid(byte[] content) {
		return content.length > HEADER_FORMAT.getLength() && content.length <= MAX_FRAME_PAYLOAD_LENGTH + HEADER_FORMAT.getLength();
	}

	public static List<ChallengeAdvertisingFrame> fromPayload(byte[] bytes, int clientId, int correlationId, int channel) {
		int boundedCorrelationId = correlationId % CORRELATION_ID_MAXVALUE;

		List<ChallengeAdvertisingFrame> frames = new ArrayList<>();

		int numFrames = (bytes.length / MAX_FRAME_PAYLOAD_LENGTH);
		if (bytes.length % MAX_FRAME_PAYLOAD_LENGTH > 0) {
			numFrames++;
		}
		for (int i = 0; i < numFrames; i++) {
			int copyStart = i * MAX_FRAME_PAYLOAD_LENGTH;
			int copyLength = Math.min(bytes.length - copyStart, MAX_FRAME_PAYLOAD_LENGTH);
			byte[] framePayload = new byte[copyLength];
			System.arraycopy(bytes, copyStart, framePayload, 0, copyLength);

			frames.add(newInstance(framePayload, clientId, i, numFrames - 1 == i, boundedCorrelationId, channel));
		}

		return frames;
	}

	public static byte[] toPayload(List<ChallengeAdvertisingFrame> frames) {
		return toPayload(frames.toArray(new ChallengeAdvertisingFrame[frames.size()]), frames.size());
	}

	public static byte[] toPayload(ChallengeAdvertisingFrame[] frames, int count) {
		int resultLength = 0;
		for (int i = 0; i < count; i++) {
			ChallengeAdvertisingFrame frame = frames[i];
			resultLength += frame.getContents().length - HEADER_FORMAT.getLength();
		}
		byte[] merge = new byte[resultLength];
		int offset = 0;
		for (int i = 0; i < count; i++) {
			ChallengeAdvertisingFrame frame = frames[i];
			int length = frame.getContents().length - HEADER_FORMAT.getLength();
			System.arraycopy(frame.getContents(), HEADER_FORMAT.getLength(), merge, offset, length);
			offset += length;
		}
		return merge;
	}

}
