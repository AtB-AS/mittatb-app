package no.entur.abt.android.bluetooth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeader;
import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeaderBinaryFormat;

public class ChallengeAdvertisingFrameHeaderTest {

	private static ChallengeAdvertisingFrameHeaderBinaryFormat FORMAT = new ChallengeAdvertisingFrameHeaderBinaryFormat();

	@Test
	public void testHeader1() {
		int clientId = 123;
		int frameNo = 11;
		int correlationId = 200;
		int channel = 2;
		ChallengeAdvertisingFrameHeader h = new ChallengeAdvertisingFrameHeader(clientId, frameNo, false, correlationId, channel);
		byte[] encoded = FORMAT.serialize(h);

		ChallengeAdvertisingFrameHeader parsed = FORMAT.parse(encoded);

		assertEquals(clientId, parsed.getClientId());
		assertEquals(correlationId, parsed.getCorrelationId());
		assertFalse(parsed.isLast());
		assertEquals(frameNo, parsed.getFrameNumber());
		assertEquals(h, parsed);
	}

	@Test
	public void testHeader2() {
		int clientId = 123;
		int frameNo = 11;
		int correlationId = 200;
		int channel = 2;
		ChallengeAdvertisingFrameHeader h = new ChallengeAdvertisingFrameHeader(clientId, frameNo, true, correlationId, channel);
		byte[] encoded = FORMAT.serialize(h);

		ChallengeAdvertisingFrameHeader parsed = FORMAT.parse(encoded);

		assertEquals(clientId, parsed.getClientId());
		assertEquals(correlationId, parsed.getCorrelationId());
		assertTrue(parsed.isLast());
		assertEquals(frameNo, parsed.getFrameNumber());
		assertEquals(h, parsed);
	}

	@Test
	public void testInvalidChannel() {
		assertThrows(IllegalArgumentException.class, () -> {
			ChallengeAdvertisingFrameHeader challengeAdvertisingFrameHeader = new ChallengeAdvertisingFrameHeader(0, 0, false, 0, 100);

			FORMAT.serialize(challengeAdvertisingFrameHeader);
		});
	}

	@Test
	public void testInvalidFrameNumber() {
		assertThrows(IllegalArgumentException.class, () -> {
			ChallengeAdvertisingFrameHeader challengeAdvertisingFrameHeader = new ChallengeAdvertisingFrameHeader(0, 100, false, 0, 0);

			FORMAT.serialize(challengeAdvertisingFrameHeader);
		});
	}

	@Test
	public void testInvalidClientId() {
		assertThrows(IllegalArgumentException.class, () -> {
			ChallengeAdvertisingFrameHeader challengeAdvertisingFrameHeader = new ChallengeAdvertisingFrameHeader(Integer.MAX_VALUE, 0, false, 0, 0);

			FORMAT.serialize(challengeAdvertisingFrameHeader);
		});
	}

	@Test
	public void testInvalidCorrelationId() {
		assertThrows(IllegalArgumentException.class, () -> {
			ChallengeAdvertisingFrameHeader challengeAdvertisingFrameHeader = new ChallengeAdvertisingFrameHeader(0, 0, false, Integer.MAX_VALUE, 0);
			FORMAT.serialize(challengeAdvertisingFrameHeader);
		});
	}
}
