package no.entur.abt.android.token.provider;

import android.util.Log;

import androidx.test.espresso.IdlingResource;

import java.time.Clock;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

import no.entur.abt.android.token.ActivatedToken;
import no.entur.abt.android.token.TokenContext;
import no.entur.abt.android.token.attestation.DeviceAttestationException;
import no.entur.abt.android.token.exception.DeviceAttestationRemoteException;
import no.entur.abt.android.token.exception.TokenStateException;

/**
 * 
 * Caching {@linkplain TokenProvider} which preemptively attempts to update the token in the background, before it expires. The preemptive updates themselves
 * run on a separate, dedicated thread. Updates are is not continuously scheduled, but (lazily) triggered by getting the token. <br>
 * <br>
 * 
 * This class is intended for uninterrupted operation, i.e. the user should not have to wait for a preemptive refresh, if possible, and so also checks an
 * {@linkplain IdlingResource} before running the refresh. <br>
 * 
 */

public class PreemptiveRenewTokenProvider<T> extends BaseTokenProvider<T> {

	protected static final long IDLE_DURATION_BEFORE_REFRESH = 3000L;

	private static final String TAG = PreemptiveRenewTokenProvider.class.getName();

	// preemptive update should execute when
	// expire - preemptiveRefresh < current time < expire.
	private final long preemptiveRefresh; // milliseconds

	private final ReentrantLock lazyLock = new ReentrantLock();

	private final ExecutorService executorService;
	private final boolean shutdownExecutorOnClose;

	private final IdlingResource idlingResource;
	private final int preemptiveRefreshPercent;

	protected final long minimumTimeToLive;
	protected final long refreshTimeout;

	protected final Clock clock;

	// cache expire time is used as its fingerprint
	// when doing preemptive refresh
	private volatile long cacheExpires;

	/**
	 * Construct new instance.
	 *
	 * @param provider               Delegate token provider
	 * @param minimumTimeToLiveUnits minimum time to live (left when returned by {@linkplain TokenProvider}).
	 * @param minimumTimeToLiveUnit  minimum time to live unit
	 * @param refreshTimeoutUnits    cache refresh timeout
	 * @param refreshTimeoutUnit     cache refresh timeout unit
	 * @param preemptiveTimeoutUnits preemptive timeout. This parameter is relative to time to live, i.e. "15 seconds before timeout, refresh time cached
	 *                               value".
	 * @param preemptiveTimeoutUnit  preemptive timeout unit
	 * @param idlingResource         resource to visit when it is time to refresh in the background
	 */

	public PreemptiveRenewTokenProvider(TokenProvider<T> provider, Clock clock, long minimumTimeToLiveUnits, TimeUnit minimumTimeToLiveUnit,
			long refreshTimeoutUnits, TimeUnit refreshTimeoutUnit, long preemptiveTimeoutUnits, TimeUnit preemptiveTimeoutUnit, int preemptiveRefreshPercent,
			IdlingResource idlingResource) {
		this(provider, clock, minimumTimeToLiveUnit.toMillis(minimumTimeToLiveUnits), refreshTimeoutUnit.toMillis(refreshTimeoutUnits),
				preemptiveTimeoutUnit.toMillis(preemptiveTimeoutUnits), preemptiveRefreshPercent, idlingResource, Executors.newSingleThreadExecutor(), true);
	}

	/**
	 * Construct new instance.
	 *
	 * @param provider          Delegate token provider
	 * @param minimumTimeToLive minimum time to live (left when returned by {@linkplain TokenProvider}).
	 * @param refreshTimeout    cache refresh timeout unit (in milliseconds)
	 * @param preemptiveRefresh preemptive refresh limit (in milliseconds). This parameter is relative to time to live, i.e. "15000 milliseconds before token is
	 * @param idlingResource    resource to visit when it is time to refresh in the background
	 */

	public PreemptiveRenewTokenProvider(TokenProvider<T> provider, Clock clock, long minimumTimeToLive, long refreshTimeout, long preemptiveRefresh,
			int preemptiveRefreshPercent, IdlingResource idlingResource) {
		this(provider, clock, minimumTimeToLive, refreshTimeout, preemptiveRefresh, preemptiveRefreshPercent, idlingResource,
				Executors.newSingleThreadExecutor(), true);
	}

	/**
	 * Construct new instance, use a custom executor service.
	 *
	 * @param provider                Delegate token provider
	 * @param minimumTimeToLive       minimum time to live (left when returned by {@linkplain TokenProvider}).
	 * @param refreshTimeout          cache refresh timeout unit (in milliseconds)
	 * @param preemptiveRefresh       preemptive timeout (in milliseconds). This parameter is relative to time to live, i.e. "15000 milliseconds before timeout,
	 *                                refresh time cached value".
	 * @param idlingResource          resource to visit when it is time to refresh in the background
	 * @param executorService         executor service
	 * @param shutdownExecutorOnClose Whether to shutdown the executor service on calls to close(..).
	 */

	public PreemptiveRenewTokenProvider(TokenProvider<T> provider, Clock clock, long minimumTimeToLive, long refreshTimeout, long preemptiveRefresh,
			int preemptiveRefreshPercent, IdlingResource idlingResource, ExecutorService executorService, boolean shutdownExecutorOnClose) {
		super(provider);
		this.clock = clock;

		this.minimumTimeToLive = minimumTimeToLive;
		this.refreshTimeout = refreshTimeout;

		if (preemptiveRefresh < minimumTimeToLive) {
			throw new IllegalArgumentException("Minimum time to live must be less than preemptive refresh limit");
		}

		this.preemptiveRefresh = preemptiveRefresh;
		this.preemptiveRefreshPercent = preemptiveRefreshPercent;
		this.executorService = executorService;
		this.shutdownExecutorOnClose = shutdownExecutorOnClose;
		this.idlingResource = idlingResource;
	}

	@Override
	public ActivatedToken<T> getToken(TokenContext<T> tokenContext, T traceId)
			throws TokenStateException, DeviceAttestationException, DeviceAttestationRemoteException {
		return getToken(tokenContext, clock.instant().toEpochMilli(), traceId);
	}

	protected ActivatedToken<T> getToken(TokenContext tokenContext, long time, T traceId)
			throws TokenStateException, DeviceAttestationException, DeviceAttestationRemoteException {
		ActivatedToken<T> activatedToken = provider.getToken(tokenContext, traceId);

		if (activatedToken != null) {
			preemptiveRefresh(time, activatedToken, traceId);
		}

		return activatedToken;
	}

	@Override
	public ActivatedToken<T> renew(ActivatedToken<T> activatedToken, T traceId)
			throws TokenStateException, DeviceAttestationException, DeviceAttestationRemoteException {
		return provider.renew(activatedToken, traceId);
	}

	/**
	 * Preemptive renewal.
	 * 
	 * @param time  current time
	 * @param token token to be preemptively renewed
	 */

	protected void preemptiveRefresh(final long time, final ActivatedToken<T> token, T traceId) {
		// no real requirement to strain version, we just want the latest.
		// strain version will be checked on a later stage

		boolean refreshable = isRefreshable(time, token);
		if (refreshable) {
			// cache will expires soon,
			// preemptively update it

			// check if an update is already in progress
			if (cacheExpires < token.getExpires()) {
				// seems no update is in progress, see if we can get the lock
				if (lazyLock.tryLock()) {
					try {
						// check again now that this thread holds the lock
						if (cacheExpires < token.getExpires()) {

							// still no update is in progress
							// signal to other threads (which come looking) that an preemptive refresh is already in progress
							cacheExpires = token.getExpires();

							// run update in the background
							executorService.execute(() -> {

								preemptiveRefreshImpl(token, traceId);
							});
						}
					} finally {
						lazyLock.unlock();
					}
				}
			}
		}
	}

	private void preemptiveRefreshImpl(ActivatedToken<T> token, T traceId) {
		// so most likely this preemptive refresh was triggered by someone wanting to do a call
		// in other words, if we manage to renew the token before that call is performed,
		// it will be rejected due to using the previous token
		// so check in with an idleing resource before renewing
		//
		// once the update is in progress, getting the current token from the cache is blocked
		try {
			long beginTimestamp = clock.instant().toEpochMilli();

			long deadline = beginTimestamp + refreshTimeout * 2;

			long idleTimestamp = -1L;
			long minimumIdleDuration = IDLE_DURATION_BEFORE_REFRESH;

			while (clock.instant().toEpochMilli() < deadline) {
				if (idlingResource.isIdleNow()) {
					if (idleTimestamp == -1L) {
						// mark idle begin
						idleTimestamp = clock.instant().toEpochMilli();
					} else if (clock.instant().toEpochMilli() > idleTimestamp + minimumIdleDuration) {
						// has idled for long enough
						Log.d(TAG, "Resource has been idle for at least " + minimumIdleDuration + ", refresh token in the background");

						// reuse correlation-id to make unit-testing more easy TODO
						provider.renew(token, traceId);
						// so next time this method is invoked, it'll be with the updated cache item expiry time
						Log.d(TAG, "Refreshed token in the background");

						return;
					}
				} else {
					idleTimestamp = -1L;
				}

				// a bit crude, but we're on a dedicated thread, so should be just fine
				Thread.sleep(100);
			}

			// time expired
			cacheExpires = -1L;
			Log.w(TAG, "Preemptive token refresh not performed due to resource in use");
		} catch (InterruptedException e) {
			cacheExpires = -1L;
			Log.w(TAG, "Preemptive token refresh interrupted", e);
			Thread.currentThread().interrupt();
		} catch (Exception e) {
			cacheExpires = -1L;
			Log.w(TAG, "Preemptive token refresh failed", e);
			// update failed, but another thread can retry
		}
	}

	protected boolean isRefreshable(long time, ActivatedToken<T> token) {
		long refreshableTime;
		if (token.getTimeToLiveMillis() < preemptiveRefresh) {
			Log.i(TAG, "Desired preemptively refresh limit is is below preemptive refresh limit");
			// this is not ideal, but the alternative is to refresh all the time
			// go by percent only
			refreshableTime = token.getExpires() - (token.getTimeToLiveMillis() * preemptiveRefreshPercent) / 100;
		} else {
			// refresh when either limit is reached
			refreshableTime = Math.min(token.getExpires() - preemptiveRefresh,
					token.getExpires() - (token.getTimeToLiveMillis() * preemptiveRefreshPercent) / 100);
		}

		long expires = token.getExpires() - minimumTimeToLive;

		if (refreshableTime > expires) { // i.e. too late
			refreshableTime = expires;
		}

		return time > refreshableTime;
	}

	/**
	 * Return the executor service which services the background refresh.
	 * 
	 * @return executor service
	 */

	public ExecutorService getExecutorService() {
		return executorService;
	}

	ReentrantLock getLazyLock() {
		return lazyLock;
	}

	@Override
	public void close() {
		super.close();

		if (shutdownExecutorOnClose) {
			executorService.shutdownNow();
			try {
				executorService.awaitTermination(refreshTimeout, TimeUnit.MILLISECONDS);
			} catch (InterruptedException e) {
				Thread.currentThread().interrupt();
				// ignore
				Log.d(TAG, "Unable to shutdown executor", e);
			}
		}
	}
}
