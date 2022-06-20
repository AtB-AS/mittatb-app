package no.entur.abt.android.bluetooth.format.v1;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import no.entur.abt.android.bluetooth.format.AbstractChallengeBinaryFormat;
import no.entur.abt.android.bluetooth.format.Challenge;
import no.entur.abt.android.bluetooth.format.UnsupportedVersionException;

/**
 * Version 0x00 of the Challenge format <br>
 * <br>
 * - Version (1 byte)<br>
 * - Size (1 byte)<br>
 * - Client Id (2 bytes)<br>
 * - Delay minutes (2 bytes)<br>
 * - Self inspect flag (1 bit )<br>
 * - Transport flag (7 bit )<br>
 * - Valid to (4 bytes)<br>
 * - Nonce (n bytes) <br>
 *
 * So In total 11 + nonce length.
 */

public class ChallengeBinaryFormat extends AbstractChallengeBinaryFormat {

	// TODO RELATE RELATIVE TIME TO START OF CERTIFICATE VALIDITY
	public static final long REFERENCE_TIME = Instant.EPOCH.plus(51 * 365L, ChronoUnit.DAYS).getEpochSecond(); // 1970 + almost 51 years
	protected static final byte SELF_INSPECT_FLAG = (byte) 0b10000000;

	protected static final long VALID_TO_LIMIT = Integer.MAX_VALUE - (long) Integer.MIN_VALUE; // in seconds

	public static final int VALID_DELAY_MIN = -65535 / 4; // in minutes. More than a week
	public static final int VALID_DELAY_MAX = 65535 + VALID_DELAY_MIN; // in minutes. More than a week
	protected static final int VALID_CLIENT_ID_LIMIT = 65535;
	protected static final int TRANSPORT_LIMIT = 127;

	protected static final int FORMAT_VERSION = 0x00;

	// binary field lengths
	// version: 1
	protected static final int SIZE_LENGTH = 2;
	protected static final int CLIENT_ID_LENGTH = 2;
	protected static final int DELAY_MINUTES_LENGTH = 2;
	protected static final int VALID_TO_SECONDS_LENGTH = 4;
	protected static final int SELF_INSPECTION_LENGTH = 1; // including transport

	protected static final int LENGTH = VERSION_LENGTH + SIZE_LENGTH + CLIENT_ID_LENGTH + DELAY_MINUTES_LENGTH + SELF_INSPECTION_LENGTH
			+ VALID_TO_SECONDS_LENGTH;
	protected static final int MAX_NONCE_LENGTH = 255 - LENGTH;

	public ChallengeBinaryFormat() {
		super(FORMAT_VERSION);
	}

	@Override
	public byte[] serialize(Challenge challenge) {
		byte[] nonce = challenge.getNonce();
		if (nonce.length > MAX_NONCE_LENGTH) {
			throw new IllegalStateException("Expected nonce length less or equal to " + MAX_NONCE_LENGTH + ", got " + nonce.length);
		}

		int size = LENGTH + nonce.length;

		byte[] buffer = new byte[size];
		writeVersion(buffer); // 0

		buffer[1] = (byte) (size & 0xFF);

		// see DataOutputStream.writeShort()
		int clientId = challenge.getClientId();
		if (clientId > VALID_CLIENT_ID_LIMIT || clientId < 0) {
			throw new IllegalStateException("Expected client id 0-" + VALID_CLIENT_ID_LIMIT + ", got " + clientId);
		}

		buffer[2] = (byte) ((clientId >>> 8) & 0xFF);
		buffer[3] = (byte) ((clientId >>> 0) & 0xFF);

		long delayMinutes = challenge.getDelay().toMinutes();
		if (delayMinutes > VALID_DELAY_MAX || delayMinutes < VALID_DELAY_MIN) {
			throw new IllegalStateException("Expected delay " + VALID_DELAY_MIN + " to " + VALID_DELAY_MAX + " minutes, got " + delayMinutes);
		}

		long unsignedDelayMinutes = delayMinutes - VALID_DELAY_MIN;

		buffer[4] = (byte) ((unsignedDelayMinutes >>> 8) & 0xFF);
		buffer[5] = (byte) ((unsignedDelayMinutes >>> 0) & 0xFF);

		if (challenge.isSelfInspect()) {
			buffer[6] = SELF_INSPECT_FLAG;
		}

		int transport = challenge.getTransport();
		if (transport > TRANSPORT_LIMIT || transport < 0) {
			throw new IllegalStateException("Expected transport 0-" + TRANSPORT_LIMIT + ", got " + transport);
		}

		buffer[6] |= transport & 0xFF;

		long validTo = challenge.getValidToTime().getEpochSecond();
		if (validTo < REFERENCE_TIME) {
			throw new IllegalStateException("Expected valid to after " + Instant.ofEpochSecond(REFERENCE_TIME) + ", got " + challenge.getValidToTime());
		}

		long validToReferenceTime = validTo - REFERENCE_TIME;
		if (validToReferenceTime > VALID_TO_LIMIT) {
			throw new IllegalStateException("Expected valid to before " + Instant.ofEpochSecond(REFERENCE_TIME + VALID_TO_LIMIT));
		}

		// see DataOutputStream.writeInt()
		buffer[7] = (byte) ((validToReferenceTime >>> 24) & 0xFF);
		buffer[8] = (byte) ((validToReferenceTime >>> 16) & 0xFF);
		buffer[9] = (byte) ((validToReferenceTime >>> 8) & 0xFF);
		buffer[10] = (byte) ((validToReferenceTime >>> 0) & 0xFF);

		System.arraycopy(nonce, 0, buffer, 11, nonce.length);

		return buffer;
	}

	@Override
	public Challenge parse(byte[] buffer) {
		int version = getVersion(buffer);
		if (version != FORMAT_VERSION) {
			// this should never happen
			throw new UnsupportedVersionException("Expected version " + String.format("%02X", FORMAT_VERSION) + ", found " + String.format("%02X", version));
		}

		int size = buffer[1] & 0xFF;

		if (buffer.length < size) {
			throw new IllegalArgumentException("Expected at least " + size + " bytes, got " + buffer.length);
		}

		int clientId = getUnsignedShort(buffer, 2);

		int delayMinutes = getUnsignedShort(buffer, 4) + VALID_DELAY_MIN;

		boolean selfInspect = (SELF_INSPECT_FLAG & buffer[6]) != 0;

		int transport = buffer[6] & 0x7F;

		long validToReferenceTime = getUnsignedInt(buffer, 7);

		long validTo = REFERENCE_TIME + validToReferenceTime;

		byte[] nonce = new byte[size - LENGTH];

		System.arraycopy(buffer, 11, nonce, 0, nonce.length);

		return Challenge.newBuilder()
				.withClientId(clientId)
				.withDelay(Duration.ofMinutes(delayMinutes))
				.withSelfInspect(selfInspect)
				.withNonce(nonce)
				.withValidToTime(Instant.ofEpochSecond(validTo))
				.withTransport(transport)
				.build();
	}

	@Override
	public int getLength(byte[] buffer) {
		// version 1
		// valid from 4
		// delay minutes
		// client id 2

		return buffer[1] & 0xFF;
	}

	// see DataInputStream.readUnsignedShort() (without useless shift)
	public static int getUnsignedShort(byte[] buffer, int offset) {
		int ch1 = buffer[offset] & 0xFF;
		int ch2 = buffer[offset + 1] & 0xFF;

		return (ch1 << 8) + ch2;
	}

	// see DataInputStream.readLong() (without useless shift)
	public static long getUnsignedInt(byte[] content, int offset) {
		return ((long) (content[offset] & 0xFF) << 24) + ((content[offset + 1] & 0xFF) << 16) + ((content[offset + 2] & 0xFF) << 8)
				+ (content[offset + 3] & 0xFF);
	}

	public Challenge truncate(Challenge challenge) {
		return Challenge.newBuilder()
				.withClientId(challenge.getClientId())
				.withDelay(Duration.ofMinutes(challenge.getDelay().toMinutes()))
				.withSelfInspect(challenge.isSelfInspect())
				.withNonce(challenge.getNonce())
				.withValidToTime(challenge.getValidToTime().truncatedTo(ChronoUnit.SECONDS))
				.withTransport(challenge.getTransport())
				.build();
	}

	@Override
	public boolean supports(Challenge challenge) {
		// only supports Challenge (and no subclasses)
		return challenge.getClass().getName().equals(Challenge.class.getName());
	}
}
