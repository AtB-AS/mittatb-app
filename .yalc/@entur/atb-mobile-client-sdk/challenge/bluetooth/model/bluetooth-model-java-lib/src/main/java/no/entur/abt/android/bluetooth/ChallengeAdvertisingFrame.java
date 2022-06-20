package no.entur.abt.android.bluetooth;

import java.util.Arrays;

import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeader;
import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeaderBinaryFormat;

/**
 * Advertising frame <br>
 * <br>
 * - Header 4 bytes<br>
 * - Payload (1-23 bytes)<br>
 * <br>
 * So in total up to 27 bytes.
 */

public class ChallengeAdvertisingFrame implements Comparable<ChallengeAdvertisingFrame> {

	// implementation note: this could have been a subclass of the header
	// but we need the header as a map key, so keep it as is

	private final ChallengeAdvertisingFrameHeader header;
	private final byte[] contents; // header + body

	public ChallengeAdvertisingFrameHeader getHeader() {
		return header;
	}

	protected ChallengeAdvertisingFrame(byte[] buffer, ChallengeAdvertisingFrameHeader header) {
		this.contents = buffer; // header + body
		this.header = header;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		ChallengeAdvertisingFrame that = (ChallengeAdvertisingFrame) o;
		return Arrays.equals(contents, that.contents);
	}

	@Override
	public int hashCode() {
		return 31 * Arrays.hashCode(contents);
	}

	@Override
	public int compareTo(ChallengeAdvertisingFrame o) {
		return ChallengeAdvertisingFrameHeader.comparator.compare(header, o.header);
	}

	public String toString() {
		return String.format("ChallengeAdvertisingFrame %d (%s) correlationId %d clientId %d header %d payload %d [..%s]", header.getFrameNumber(),
				header.isLast() ? "last" : "not last", header.getCorrelationId(), header.getClientId(),
				ChallengeAdvertisingFrameHeaderBinaryFormat.FRAME_HEADER_LENGTH,
				contents.length - ChallengeAdvertisingFrameHeaderBinaryFormat.FRAME_HEADER_LENGTH, String.format("%02X", contents[contents.length - 1]));
	}

	public byte[] getContents() {
		return contents;
	}

	public byte[] toByteArray() {
		return contents;
	}

}
