package no.entur.abt.android.bluetooth;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeader;
import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeaderBinaryFormat;

public class ChallengeAdvertisingFrameTest {

	private static ChallengeAdvertisingFrameHeaderBinaryFormat FORMAT = new ChallengeAdvertisingFrameHeaderBinaryFormat();

	@Test
	public void testRoundtrip() {
		Random random = new Random();
		for (int i = 16; i < 256; i += 16) {

			byte[] content = new byte[i];
			random.nextBytes(content);

			List<ChallengeAdvertisingFrame> frames = ChallengeAdvertisingFrameBinaryFormat.fromPayload(content, i, i * 2, 0);
			assertCompleteFrameSet(frames);

			byte[] reconstructed = ChallengeAdvertisingFrameBinaryFormat.toPayload(frames);

			assertArrayEquals(content, reconstructed);
		}
	}

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

	public static void assertCompleteFrameSet(List<ChallengeAdvertisingFrame> frames) {
		assertFalse(frames.isEmpty());

		// CorrelationId must be equal
		// Frame count must be equal
		// One frame each frame number

		ChallengeAdvertisingFrameHeader lastHeader = frames.get(frames.size() - 1).getHeader();
		assertTrue(lastHeader.isLast());

		for (ChallengeAdvertisingFrame f : frames) {
			if (f.getHeader() != lastHeader) {
				assertFalse(f.getHeader().isLast());
			}
		}

		Set<Integer> frameIndexes = frames.stream().map(e -> e.getHeader().getFrameNumber()).collect(Collectors.toSet());
		for (Integer frameIndex : frameIndexes) {
			assertFalse(frameIndex >= frames.size());
		}

		Set<Integer> correlationId = frames.stream().map(e -> e.getHeader().getCorrelationId()).collect(Collectors.toSet());
		Set<Integer> channels = frames.stream().map(e -> e.getHeader().getChannel()).collect(Collectors.toSet());
		Set<Integer> clientIds = frames.stream().map(e -> e.getHeader().getClientId()).collect(Collectors.toSet());

		assertEquals(frameIndexes.size(), lastHeader.getFrameNumber() + 1);
		assertEquals(correlationId.size(), 1);
		assertEquals(channels.size(), 1);
		assertEquals(clientIds.size(), 1);
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
