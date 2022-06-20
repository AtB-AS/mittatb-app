package no.entur.abt.android.bluetooth.format;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

public class DummyChallengeBinaryFormat extends AbstractChallengeBinaryFormat {

	public DummyChallengeBinaryFormat() {
		super(0xFF);
	}

	@Override
	public Challenge parse(byte[] content) {
		return new DummyChallenge(1, Duration.ZERO, false, new byte[] { 0, 1, 0, 1, 0, 1, 0, 1 }, Instant.now(), Instant.now().plus(1, ChronoUnit.HOURS), 0);
	}

	@Override
	public int getLength(byte[] content) {
		return content[1] & 0xFF;
	}

	@Override
	public boolean supports(Challenge challenge) {
		return challenge instanceof DummyChallenge;
	}

	@Override
	public byte[] serialize(Challenge challenge) {
		if (challenge instanceof DummyChallenge) {
			byte[] bytes = new byte[24];
			bytes[0] = (byte) 0xFF;
			bytes[1] = (byte) 24;
			for (int i = 2; i < bytes.length; i++) {
				bytes[i] = (byte) i;
			}
			return bytes;
		}
		throw new IllegalArgumentException();
	}

}
