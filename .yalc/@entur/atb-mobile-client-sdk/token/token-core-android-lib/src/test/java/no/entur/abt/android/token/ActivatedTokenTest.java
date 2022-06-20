package no.entur.abt.android.token;

import static com.google.common.truth.Truth.assertThat;

import java.time.Clock;
import java.time.Instant;

import org.junit.Test;

public class ActivatedTokenTest {

	protected Clock clock = Clock.systemUTC();

	@Test
	public <T> void testForwardsToLatestToken() {
		ActivatedToken<T> token = new ActivatedToken<>("a.b.c", Instant.now(), Instant.now().plusSeconds(3600), null, null, null, null, null, clock, 0, null);
		ActivatedToken<T> refreshedToken1 = new ActivatedToken<>("a.b.c", Instant.now().plusSeconds(3600), Instant.now().plusSeconds(7200), null, null, null,
				null, null, clock, 0, null);
		ActivatedToken<T> refreshedToken2 = new ActivatedToken<>("a.b.c", Instant.now().plusSeconds(3600), Instant.now().plusSeconds(7200), null, null, null,
				null, null, clock, 0, null);

		token.setRenewToken(refreshedToken1);
		refreshedToken1.setRenewToken(refreshedToken2);

		assertThat(token.forward()).isSameInstanceAs(refreshedToken2);
	}

}
