package no.entur.abt.android.token.provider;

import static com.google.common.truth.Truth.assertThat;
import static no.entur.abt.android.token.provider.PreemptiveRenewTokenProvider.IDLE_DURATION_BEFORE_REFRESH;
import static org.junit.Assert.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.only;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import androidx.test.espresso.idling.CountingIdlingResource;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentCaptor;

import no.entur.abt.android.test.ThreadHelper;
import no.entur.abt.android.token.ActivatedToken;

public class PreemptiveRenewTokenProviderTest extends AbstractDelegateProviderTest {

	private long idleDurationBeforeRefreshInSeconds = IDLE_DURATION_BEFORE_REFRESH / 1000;

	private Runnable lockRunnable = new Runnable() {
		@Override
		public void run() {
			if (!provider.getLazyLock().tryLock()) {
				throw new RuntimeException();
			}
		}
	};

	private Runnable unlockRunnable = new Runnable() {
		@Override
		public void run() {
			provider.getLazyLock().unlock();
		}
	};

	private PreemptiveRenewTokenProvider provider;
	private CountingIdlingResource idleingResource = new CountingIdlingResource("test");

	@Before
	public void setUp() throws Exception {
		super.setUp();
		provider = new PreemptiveRenewTokenProvider(fallback, clock, 10, TimeUnit.SECONDS, 15, TimeUnit.SECONDS, 15, TimeUnit.SECONDS, 0, idleingResource);
	}

	@After
	public void shutdown() throws Exception {
		if (provider != null) {
			provider.close();
		}
	}

	@Test
	public void shouldPreemptivelyRefreshCache() throws Exception {
		String correlationId = UUID.randomUUID().toString();
		when(fallback.getToken(tokenContext, correlationId)).thenReturn(token);
		when(fallback.renew(token, correlationId)).thenReturn(refreshedToken);

		assertThat(provider.getToken(tokenContext, correlationId)).isSameInstanceAs(token);
		verify(fallback, only()).getToken(tokenContext, correlationId);

		long justBeforeExpiry = getExpires(token, 5);

		assertThat(provider.getToken(tokenContext, justBeforeExpiry, correlationId)).isSameInstanceAs(token); // triggers a preemptive refresh attempt

		provider.getExecutorService().awaitTermination(1 + idleDurationBeforeRefreshInSeconds, TimeUnit.SECONDS);

		verify(fallback, times(2)).getToken(tokenContext, correlationId);
		verify(fallback, times(1)).renew(eq(token), any());
	}

	@Test
	public void shouldNotPreemptivelyRefreshCacheIfRefreshAlreadyInProgressOrHasAlreadyBeenPerformed() throws Exception {
		String correlationId = UUID.randomUUID().toString();
		when(fallback.getToken(tokenContext, correlationId)).thenReturn(token);
		when(fallback.renew(token, correlationId)).thenReturn(refreshedToken);

		// first
		assertThat(provider.getToken(tokenContext, correlationId)).isSameInstanceAs(token);
		verify(fallback, only()).getToken(tokenContext, correlationId);

		long justBeforeExpiry = getExpires(token, 5);

		// second
		assertThat(provider.getToken(tokenContext, justBeforeExpiry, correlationId)).isSameInstanceAs(token); // triggers a preemptive refresh attempt
		provider.preemptiveRefresh(justBeforeExpiry, token, correlationId); // should not trigger a preemptive refresh attempt; cannot get lock

		provider.getExecutorService().awaitTermination(1 + idleDurationBeforeRefreshInSeconds, TimeUnit.SECONDS);
		provider.preemptiveRefresh(justBeforeExpiry, token, correlationId); // should not trigger a preemptive refresh attempt now either; cache is already
																			// updated (for that
		// token)
		verify(fallback, times(2)).getToken(tokenContext, correlationId);
		verify(fallback, times(1)).renew(token, correlationId);
	}

	@Test
	public void shouldFirePreemptivelyRefreshCacheAgainIfPreviousPreemptivelyRefreshAttemptFailed() throws Exception {
		String correlationId = UUID.randomUUID().toString();
		when(fallback.getToken(tokenContext, correlationId)).thenReturn(token);
		when(fallback.renew(token, correlationId)).thenThrow(new RuntimeException("TEST!")).thenReturn(refreshedToken);

		// first
		assertThat(provider.getToken(tokenContext, correlationId)).isSameInstanceAs(token);
		verify(fallback, only()).getToken(tokenContext, correlationId);

		long justBeforeExpiry = getExpires(token, 5);

		// second
		assertThat(provider.getToken(tokenContext, justBeforeExpiry, correlationId)).isSameInstanceAs(token); // triggers a preemptive refresh attempt, but it
																												// blows up with
		// an exception
		provider.getExecutorService().awaitTermination(1 + idleDurationBeforeRefreshInSeconds, TimeUnit.SECONDS);

		assertThat(provider.getToken(tokenContext, justBeforeExpiry, correlationId)).isSameInstanceAs(token); // triggers a new preemptive refresh attempt
		provider.getExecutorService().awaitTermination(1 + idleDurationBeforeRefreshInSeconds, TimeUnit.SECONDS);

		verify(fallback, times(3)).getToken(tokenContext, correlationId);

		ArgumentCaptor<String> correlationIds = ArgumentCaptor.forClass(String.class);
		ArgumentCaptor<ActivatedToken<String>> tokens = ArgumentCaptor.forClass(ActivatedToken.class);

		verify(fallback, times(2)).renew(tokens.capture(), correlationIds.capture());
		// verify(fallback, times(2)).renew(eq(token), any(String.class));

		List<ActivatedToken<String>> allTokenValues = tokens.getAllValues();
		assertEquals(allTokenValues.size(), 2);
		assertEquals(allTokenValues.get(0), token);

		List<String> allValues = correlationIds.getAllValues();
		assertEquals(allValues.size(), 2);
		assertEquals(allValues.get(0), correlationId);
		assertEquals(allValues.get(1), correlationId);
	}

	private long getExpires(ActivatedToken<String> token, long l) {
		return token.getExpires() - TimeUnit.SECONDS.toMillis(l);
	}

	@Test
	public void shouldAccceptIfAnotherThreadPreemptivelyUpdatesCache() throws Exception {
		String correlationId = UUID.randomUUID().toString();

		long justBeforeExpiry = getExpires(token, 5);

		ThreadHelper helper = new ThreadHelper().addRun(lockRunnable).addPause().addRun(unlockRunnable);
		try {
			helper.begin();

			provider.getToken(tokenContext, justBeforeExpiry, correlationId); // wants to update preemptively, but can't get lock

			verify(fallback, times(0)).renew(token, correlationId);
		} finally {
			helper.close();
		}
	}

	@Test
	public void shouldAdjustRefreshableLimitByPercentOfTokenTimeToLive() {
		int percent = 20;

		PreemptiveRenewTokenProvider providerWithPercentLimit = new PreemptiveRenewTokenProvider(fallback, clock, 10, TimeUnit.SECONDS, 15, TimeUnit.SECONDS,
				24, TimeUnit.HOURS, 20, idleingResource);

		int days = 180;
		Instant now = Instant.now();
		Instant nextYear = now.plus(days, ChronoUnit.DAYS);

		ActivatedToken<String> token = new ActivatedToken<>(null, now, nextYear, null, null, null, null, null, null, -1, tokenContext);

		Instant justBeforePercentLimit = now.plus(days - (days * percent) / 100, ChronoUnit.DAYS).plusMillis(-1);

		assertThat(providerWithPercentLimit.isRefreshable(justBeforePercentLimit.toEpochMilli(), token)).isFalse();

		Instant justAfterPercentLimit = now.plus(days - (days * percent) / 100, ChronoUnit.DAYS).plusMillis(1);
		assertThat(providerWithPercentLimit.isRefreshable(justAfterPercentLimit.toEpochMilli(), token)).isTrue();
	}
}
