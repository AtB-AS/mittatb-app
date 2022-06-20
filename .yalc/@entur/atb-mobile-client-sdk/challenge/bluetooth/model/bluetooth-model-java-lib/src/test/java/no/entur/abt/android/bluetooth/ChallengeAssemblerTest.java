package no.entur.abt.android.bluetooth;

import static org.junit.jupiter.api.Assertions.*;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Random;

import org.junit.jupiter.api.Test;

import no.entur.abt.android.bluetooth.header.ChallengeAdvertisingFrameHeader;

public class ChallengeAssemblerTest {

	private final int MAX_SHORT = Short.MAX_VALUE + (int) Short.MIN_VALUE;

	public static List<byte[]> getPayloads() {
		List<byte[]> result = new ArrayList<>();

		Random random = new Random();

		for (int k = 0; k < 4; k++) {
			byte[] serialize = new byte[23 * 4 - k];
			random.nextBytes(serialize);
			result.add(serialize);
		}

		return result;
	}

	@Test
	public void testAssembleNonceFromAnySequenceFrames() throws Exception {
		List<byte[]> payloads = getPayloads();
		for (byte[] serialize : payloads) {
			List<ChallengeAdvertisingFrame> frames = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize, 0, 1, 2);
			assertEquals(4, frames.size());

			PermutationIterator<ChallengeAdvertisingFrame> iterator = new PermutationIterator(new ArrayList<>(frames));
			while (iterator.hasNext()) {
				List<ChallengeAdvertisingFrame> sequence = iterator.next();
				assertReassembly(serialize, sequence);
			}
		}
	}

	@Test
	public void testValues() throws Exception {
		List<byte[]> payloads = getPayloads();
		for (byte[] serialize : payloads) {
			ChallengeAdvertisingFrameAssembler assembler = new ChallengeAdvertisingFrameAssembler();
			for (int i = 0; i < MAX_SHORT; i++) {
				List<ChallengeAdvertisingFrame> sequence = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize, i, 1, 2);
				assertReassembly(serialize, sequence);
			}

			assembler = new ChallengeAdvertisingFrameAssembler();
			for (int i = 0; i < MAX_SHORT; i++) {
				List<ChallengeAdvertisingFrame> sequence = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize, 0, i, 1);
				assertReassembly(serialize, sequence);
			}

			assembler = new ChallengeAdvertisingFrameAssembler();
			for (int i = 0; i < 8; i++) {
				List<ChallengeAdvertisingFrame> sequence = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize, 0, 1, i);
				assertReassembly(serialize, sequence);
			}
		}
	}

	private void assertReassembly(byte[] serialize, List<ChallengeAdvertisingFrame> sequence) {
		ChallengeAdvertisingFrameAssembler assembler = new ChallengeAdvertisingFrameAssembler();
		for (int k = 0; k < sequence.size() - 1; k++) {
			assertNull(assembler.addFrame(sequence.get(k)));
		}
		byte[] deserialized = assembler.addFrame(sequence.get(sequence.size() - 1));
		assertNotNull(deserialized);
		assertArrayEquals(deserialized, serialize);
	}

	@Test
	public void testNonRepeatingCallbackOnNewChallenge() throws Exception {
		List<byte[]> payloads = getPayloads();
		for (byte[] serialize : payloads) {

			List<ChallengeAdvertisingFrame> frames = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize, 0, 1, 2);
			assertEquals(4, frames.size());

			PermutationIterator<ChallengeAdvertisingFrame> iterator = new PermutationIterator(frames);

			List<ChallengeAdvertisingFrame> allFrames = new ArrayList<>();
			while (iterator.hasNext()) {
				allFrames.addAll(iterator.next());
			}
			ChallengeAdvertisingFrameAssembler assembler = new ChallengeAdvertisingFrameAssembler();

			int numNonceFoundCount = 0;

			for (ChallengeAdvertisingFrame frame : allFrames) {
				byte[] newChallenge = assembler.addFrame(frame);
				if (newChallenge != null) {
					numNonceFoundCount += 1;
				}
			}
			assertEquals(1, numNonceFoundCount);
		}

	}

	@Test
	public void testTwoDifferentClientIds() throws Exception {
		List<byte[]> payloads1 = getPayloads();
		List<byte[]> payloads2 = getPayloads();

		for (int k = 0; k < payloads1.size(); k++) {
			byte[] serialize1 = payloads1.get(k);
			byte[] serialize2 = payloads2.get(k);

			List<ChallengeAdvertisingFrame> frames1 = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize1, 0, 2, 0);
			List<ChallengeAdvertisingFrame> frames2 = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize2, 1, 3, 0);

			assertAssemblesAsTwo(frames1, frames2);
		}
	}

	private void assertAssemblesAsTwo(List<ChallengeAdvertisingFrame> frames1, List<ChallengeAdvertisingFrame> frames2) {
		ChallengeAdvertisingFrameAssembler assembler = new ChallengeAdvertisingFrameAssembler();
		Iterator<ChallengeAdvertisingFrame> iterator1 = frames1.iterator();
		Iterator<ChallengeAdvertisingFrame> iterator2 = frames2.iterator();

		int count = 0;
		for (int i = 0; i < frames1.size(); i++) {
			if (assembler.addFrame(iterator1.next()) != null) {
				count++;
			}
			if (assembler.addFrame(iterator2.next()) != null) {
				count++;
			}
		}

		assertEquals(2, count);
	}

	@Test
	public void testTwoDifferentCorrelationId() throws Exception {
		List<byte[]> payloads1 = getPayloads();
		List<byte[]> payloads2 = getPayloads();

		for (int k = 0; k < payloads1.size(); k++) {
			byte[] serialize1 = payloads1.get(k);
			byte[] serialize2 = payloads2.get(k);

			List<ChallengeAdvertisingFrame> frames1 = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize1, 1, 2, 0);
			List<ChallengeAdvertisingFrame> frames2 = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize2, 1, 3, 0);

			assertAssemblesAsTwo(frames1, frames2);
		}
	}

	@Test
	public void testTwoDifferentChannelIds() throws Exception {
		List<byte[]> payloads1 = getPayloads();
		List<byte[]> payloads2 = getPayloads();
		for (int k = 0; k < payloads1.size(); k++) {
			byte[] serialize1 = payloads1.get(k);
			byte[] serialize2 = payloads2.get(k);

			List<ChallengeAdvertisingFrame> frames1 = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize1, 0, 2, 0);
			List<ChallengeAdvertisingFrame> frames2 = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize2, 0, 2, 1);

			assertAssemblesAsTwo(frames1, frames2);
		}
	}

	@Test
	public void testAssembleNonceDiscardsPreviousLastFrame() throws Exception {
		List<byte[]> payloads = getPayloads();
		for (byte[] serialize : payloads) {
			List<ChallengeAdvertisingFrame> framesList = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize, 0, 1, 2);
			assertEquals(4, framesList.size());

			ChallengeAdvertisingFrameAssembler assembler = new ChallengeAdvertisingFrameAssembler();

			for (int i = 0; i < framesList.size() - 1; i++) {
				assertNull(assembler.addFrame(framesList.get(i)));
			}

			ChallengeAdvertisingFrameHeader jitterHeader = new ChallengeAdvertisingFrameHeader(0, 6, true, 1, 2);
			ChallengeAdvertisingFrame jitterFrame = new ChallengeAdvertisingFrame(new byte[] { 0x0, 0x1, 0x2 }, jitterHeader);
			assertNull(assembler.addFrame(jitterFrame));

			assertNotNull(assembler.addFrame(framesList.get(framesList.size() - 1)));
		}
	}

	@Test
	public void testAssembleNonceDiscardsFramesWithTooHighFrameNumberForNewLastFrame() throws Exception {
		List<byte[]> payloads = getPayloads();
		for (byte[] serialize : payloads) {
			List<ChallengeAdvertisingFrame> framesList = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize, 0, 1, 2);
			assertEquals(4, framesList.size());

			ChallengeAdvertisingFrameAssembler assembler = new ChallengeAdvertisingFrameAssembler();

			for (int i = 0; i < framesList.size() - 1; i++) {
				assertNull(assembler.addFrame(framesList.get(i)));
			}

			ChallengeAdvertisingFrameHeader jitterHeader = new ChallengeAdvertisingFrameHeader(0, 6, false, 1, 2);
			ChallengeAdvertisingFrame jitter = new ChallengeAdvertisingFrame(new byte[] { 0x0, 0x1, 0x2 }, jitterHeader);
			assertNull(assembler.addFrame(jitter));

			assertNotNull(assembler.addFrame(framesList.get(framesList.size() - 1)));
		}
	}

	@Test
	public void testAssembleNonceDiscardsPreexistingFramesWithToHighFrameNumber() throws Exception {

		List<byte[]> payloads = getPayloads();
		for (byte[] serialize : payloads) {
			List<ChallengeAdvertisingFrame> framesList = ChallengeAdvertisingFrameBinaryFormat.fromPayload(serialize, 0, 1, 2);
			assertEquals(4, framesList.size());

			ChallengeAdvertisingFrameAssembler assembler = new ChallengeAdvertisingFrameAssembler();

			ChallengeAdvertisingFrameHeader jitterHeader = new ChallengeAdvertisingFrameHeader(0, 6, false, 1, 2);
			ChallengeAdvertisingFrame jitter = new ChallengeAdvertisingFrame(new byte[] { 0x0, 0x1, 0x2 }, jitterHeader);
			assertNull(assembler.addFrame(jitter));

			assertNull(assembler.addFrame(framesList.get(framesList.size() - 1)));

			for (int i = 0; i < framesList.size() - 2; i++) {
				ChallengeAdvertisingFrame challengeAdvertisingFrame = framesList.get(i);
				System.out.println(i + " " + challengeAdvertisingFrame.getHeader().getFrameNumber());
				assertNull(assembler.addFrame(framesList.get(i)));
			}
			assertNotNull(assembler.addFrame(framesList.get(framesList.size() - 2)));
		}
	}

}
