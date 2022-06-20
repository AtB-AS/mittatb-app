package no.entur.abt.android.bluetooth;

import static org.junit.jupiter.api.Assertions.fail;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.junit.jupiter.api.Test;

public class ChallengeAdvertisingFrameFilterTest {

	private ChallengeAdvertisingFrameFilter filter = new ChallengeAdvertisingFrameFilter();

	@Test
	public void testFilter() {
		Random random = new Random();

		List<ChallengeAdvertisingFrame> frames = new ArrayList<>();
		for (int clientId = 0; clientId < 65535 - 1000; clientId += 1000) {
			for (int correlationId = 0; correlationId < 256 - 10; correlationId += 10) {
				for (int channel = 0; channel < 8 - 2; channel += 2) {
					for (int frameNumber = 0; frameNumber < 16; frameNumber += 1) {
						byte[] content = new byte[23];
						random.nextBytes(content);

						frames.add(
								ChallengeAdvertisingFrameBinaryFormat.newInstance(content, clientId, frameNumber, frameNumber == 15, correlationId, channel));
					}
				}
			}
		}

		for (ChallengeAdvertisingFrame frame : frames) {
			if (filter.hasFrame(frame.toByteArray())) {
				fail();
			}
			if (!filter.hasFrame(frame.toByteArray())) {
				fail();
			}
		}
	}
}
