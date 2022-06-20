package no.entur.abt.android.token.provider;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;

import org.junit.Before;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.TokenContext;

public abstract class AbstractDelegateProviderTest {

	protected TokenProvider fallback;
	protected ActivatedToken<String> token;
	protected ActivatedToken<String> refreshedToken;

	protected Clock clock = Clock.systemUTC();

	protected TokenContext tokenContext;

	@Before
	public void setUp() throws Exception {

		tokenContext = mock(TokenContext.class);
		when(tokenContext.getId()).thenReturn("entur");

		fallback = mock(TokenProvider.class);

		token = new ActivatedToken<>("a.b.c", Instant.now(), Instant.now().plusSeconds(3600), null, null, null, null, null, clock, 0, null);
		refreshedToken = new ActivatedToken<>("a.b.c", Instant.now().plusSeconds(3600), Instant.now().plusSeconds(7200), null, null, null, null, null, clock, 0,
				null);

		when(fallback.getToken(any(TokenContext.class), any(String.class))).thenReturn(refreshedToken);
		when(fallback.getToken(any(TokenContext.class), any(String.class))).thenReturn(token);
	}

}
