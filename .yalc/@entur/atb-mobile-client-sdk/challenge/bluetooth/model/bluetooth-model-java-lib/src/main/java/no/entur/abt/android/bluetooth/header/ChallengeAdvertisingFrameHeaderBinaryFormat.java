package no.entur.abt.android.bluetooth.header;

/**
 * Header format <br>
 * <br>
 * - Channel (3 bit)<br>
 * - Last frame (1 bit)<br>
 * - Frame number (4 bit)<br>
 * - Client id (2 bytes)<br>
 * - Correlation id (1 byte)<br>
 * <br>
 * So in total 4 bytes.
 */

public class ChallengeAdvertisingFrameHeaderBinaryFormat {

	public static final int FRAME_HEADER_LENGTH = 4;

	private static final int LAST_FRAME_MASK = 0b00010000;
	private static final int CHANNEL_MASK = 0b00000111;
	private static final int FRAME_NUMBER_MASK = 0b00001111;

	public static final int MAX_FRAMES = 16;
	private static final int MAX_CLIENT_ID = 65535;
	private static final int MAX_CORRELATION_ID = 255;

	public ChallengeAdvertisingFrameHeader parse(byte[] headerBytes) {
		byte b = headerBytes[0]; // CCCLNNNN

		int channel = (b >>> 5) & CHANNEL_MASK; // CCC
		boolean lastFrame = (b & LAST_FRAME_MASK) != 0; // L
		int frameNumber = b & FRAME_NUMBER_MASK; // NNNN

		// see DataInputStream.readUnsignedShort()
		int clientId = ((headerBytes[1] & 0xFF) << 8) + (headerBytes[2] & 0xFF);
		// see DataInputStream.readUnsignedByte()
		int correlationId = headerBytes[3] & 0xFF;

		return new ChallengeAdvertisingFrameHeader(clientId, frameNumber, lastFrame, correlationId, channel);
	}

	public byte[] serialize(ChallengeAdvertisingFrameHeader header) {
		byte[] buffer = new byte[FRAME_HEADER_LENGTH];

		return serialize(buffer, header);
	}

	public byte[] serialize(byte[] buffer, ChallengeAdvertisingFrameHeader header) {
		int frameNumber = header.getFrameNumber();
		if (frameNumber >= MAX_FRAMES || frameNumber < 0) {
			throw new IllegalArgumentException("Frame number must be 0-" + (MAX_FRAMES - 1) + ", got " + frameNumber);
		}
		int channel = header.getChannel();
		if (channel > 7 || channel < 0) {
			throw new IllegalArgumentException("Channel must be 0-7, got" + channel);
		}
		int correlationId = header.getCorrelationId();
		if (correlationId > MAX_CORRELATION_ID || correlationId < 0) {
			throw new IllegalArgumentException("Correlation id must be 0-" + MAX_CORRELATION_ID + ", got" + channel);
		}
		int clientId = header.getClientId();
		if (clientId > MAX_CLIENT_ID || clientId < 0) {
			throw new IllegalArgumentException("Client id must be 0-" + MAX_CLIENT_ID + ", got" + channel);
		}

		int h = channel << 5 | frameNumber;
		if (header.isLast()) {
			h = h | LAST_FRAME_MASK;
		}
		buffer[0] = (byte) (h & 0xFF);

		// see DataOutputStream.writeShort()
		buffer[1] = (byte) ((clientId >>> 8) & 0xFF);
		buffer[2] = (byte) ((clientId >>> 0) & 0xFF);
		buffer[3] = (byte) (correlationId & 0xFF);

		return buffer;
	}

	public int getLength() {
		return FRAME_HEADER_LENGTH;
	}

}
