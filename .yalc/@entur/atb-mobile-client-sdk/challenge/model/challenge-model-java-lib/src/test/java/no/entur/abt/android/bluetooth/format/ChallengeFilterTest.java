package no.entur.abt.android.bluetooth.format;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;

import org.junit.jupiter.api.Test;

public class ChallengeFilterTest extends AbstractChallengeTest {

	@Test
	public void testFilter() throws Exception {
		ChallengeFilter filter = new ChallengeFilter(clock);

		Challenge challenge1 = builder.build();
		Challenge challenge2 = builder.withClientId((short) (challenge1.getClientId() + 1)).build();

		SignedChallenge signedChallenge1a = new SignedChallenge(new byte[] { 0 }, challenge1);
		Set<SignedChallenge> add = filter.add(signedChallenge1a);
		assertEquals(1, add.size());

		SignedChallenge signedChallenge1b = new SignedChallenge(new byte[] { 0 }, challenge1);
		add = filter.add(signedChallenge1b);
		assertEquals(1, add.size());
		assertSame(add.iterator().next(), signedChallenge1a);

		SignedChallenge signedChallenge2 = new SignedChallenge(new byte[] { 0 }, challenge2);
		add = filter.add(signedChallenge2);
		assertEquals(2, add.size());

		assertTrue(add.contains(signedChallenge1a));
		assertTrue(add.contains(signedChallenge2));
	}
}
