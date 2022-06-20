package no.entur.abt.android.bluetooth.format.v1;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.junit.jupiter.api.Test;

import no.entur.abt.android.bluetooth.format.AbstractChallengeTest;
import no.entur.abt.android.bluetooth.format.Challenge;

public class ChallengeBinaryFormatTest extends AbstractChallengeTest {

	@Test
	public void testRoundtrip() {
		Challenge challenge = builder.build();
		assertRoundTrip(challenge);
	}

	@Test
	public void testDelay() {
		int unsingedShortMax = 65535;
		int min = -65535 / 4;
		int max = unsingedShortMax + min;
		for (int i = min; i < max; i += 1000) {
			Challenge challenge = builder.withDelay(Duration.ofMinutes(i)).build();

			assertRoundTrip(challenge);
			assertEquals(challenge.getDelay(), Duration.ofMinutes(i));
		}
	}

	@Test
	public void testDelayExceeded() {
		Challenge challenge = builder.withDelay(Duration.ofMinutes(ChallengeBinaryFormat.VALID_DELAY_MAX + 1)).build();
		assertThrows(IllegalStateException.class, () -> {
			format.serialize(challenge);
		});
	}

	@Test
	public void testValidDuration() {
		Challenge challenge = builder
				.withValidToTime(clock.instant().truncatedTo(ChronoUnit.SECONDS).plus(ChallengeBinaryFormat.VALID_TO_LIMIT / 2, ChronoUnit.SECONDS))
				.build();

		assertRoundTrip(challenge);
	}

	@Test
	public void testValidDurationExceeded() {
		Challenge challenge = builder
				.withValidToTime(clock.instant().truncatedTo(ChronoUnit.SECONDS).plus(ChallengeBinaryFormat.VALID_TO_LIMIT + 1, ChronoUnit.SECONDS))
				.build();

		assertThrows(IllegalStateException.class, () -> {
			format.serialize(challenge);
		});
	}

	@Test
	public void testReferenceTime() {
		Instant instant = Instant.ofEpochSecond(ChallengeBinaryFormat.REFERENCE_TIME).minus(1, ChronoUnit.DAYS);

		Challenge challenge = builder.withValidToTime(instant).build();

		assertThrows(IllegalStateException.class, () -> {
			format.serialize(challenge);
		});
	}

	@Test
	public void testNonceLength() {
		Challenge challenge = builder.withNonce(new byte[255 - ChallengeBinaryFormat.LENGTH]).build();
		assertRoundTrip(challenge);
	}

	@Test
	public void testNonceLengthExceeded() {
		Challenge challenge = builder.withNonce(new byte[255 - ChallengeBinaryFormat.LENGTH + 1]).build();
		assertThrows(IllegalStateException.class, () -> {
			format.serialize(challenge);
		});
	}

	@Test
	public void testSelfInspect() {
		assertRoundTrip(builder.withSelfInspect(false).build());
		assertRoundTrip(builder.withSelfInspect(true).build());
	}

	private void assertRoundTrip(Challenge challenge) {
		byte[] serialize = format.serialize(challenge);
		assertEquals(format.getLength(serialize), serialize.length);
		assertTrue(format.supports(serialize));
		Challenge parse = format.parse(serialize);
		assertEquals(format.truncate(challenge), parse);
		assertEquals(format.getLength(serialize), ChallengeBinaryFormat.LENGTH + challenge.getNonce().length);
	}

	@Test
	public void testClientIdExceeded() {
		Challenge challenge = builder.withClientId(Integer.MAX_VALUE).build();
		assertThrows(IllegalStateException.class, () -> {
			format.serialize(challenge);
		});
	}

	@Test
	public void testClientId() {
		for (int i = 0; i < Short.MAX_VALUE * 2 - 1; i += 1000) {
			Challenge challenge = builder.withClientId(i).build();
			assertRoundTrip(challenge);
		}
	}

	@Test
	public void testTransportExceeded() {
		Challenge challenge = builder.withTransport(Integer.MAX_VALUE).build();

		assertThrows(IllegalStateException.class, () -> {
			format.serialize(challenge);
		});
	}

	@Test
	public void testTransport() {
		for (int i = 0; i < 127; i++) {
			Challenge challenge = builder.withTransport(i).build();
			assertRoundTrip(challenge);
		}
	}
}
