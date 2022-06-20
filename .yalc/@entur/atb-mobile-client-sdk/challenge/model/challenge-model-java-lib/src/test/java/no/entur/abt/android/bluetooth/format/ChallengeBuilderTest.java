package no.entur.abt.android.bluetooth.format;

import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

public class ChallengeBuilderTest extends AbstractChallengeTest {

	@Test
	public void testNonce() {
		assertThrows(IllegalStateException.class, () -> {
			builder.withNonce(null).build();
		});
	}

}
