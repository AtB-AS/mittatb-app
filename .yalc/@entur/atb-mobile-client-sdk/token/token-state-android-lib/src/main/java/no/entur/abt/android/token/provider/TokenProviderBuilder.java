package no.entur.abt.android.token.provider;

import androidx.test.espresso.IdlingResource;

import java.time.Clock;
import java.util.concurrent.TimeUnit;

import no.entur.abt.android.token.TokenFactory;
import no.entur.abt.android.token.TokenRenewer;

public class TokenProviderBuilder<T> {

	public static <T> TokenProviderBuilder<T> newBuilder(TokenFactory<T> tokenFactory) {
		return new TokenProviderBuilder<>(tokenFactory);
	}

	// cache
	protected boolean cached = true;
	/** minimum time to live, when returned from the cache */
	protected TimeUnit minimumTimeToLiveUnit = TimeUnit.SECONDS;
	protected long minimumTimeToLiveUnits = 15;

	protected TimeUnit refreshExpiresUnit = TimeUnit.SECONDS;
	protected long refreshExpiresIn = 30;

	protected boolean preemptiveRefresh = true;
	protected TimeUnit preemptiveRefreshTimeUnit = TimeUnit.HOURS;
	protected long preemptiveRefreshTimeUnits = 24;
	protected int preemptiveRefreshPercent = -1;
	protected IdlingResource preemptiveRefreshIdlingResource;

	protected TokenRenewer<T> tokenRenewer;

	// retrying
	protected boolean retrying = true;

	protected TokenFactory<T> tokenFactory;

	protected Clock clock;

	public TokenProviderBuilder(TokenFactory<T> tokenFactory) {
		this.tokenFactory = tokenFactory;
	}

	public TokenProviderBuilder<T> withTokenRenewer(TokenRenewer<T> tokenRenewer) {
		this.tokenRenewer = tokenRenewer;

		return this;
	}

	/**
	 * Toggle the cache of {@linkplain no.entur.abt.android.token.ActivatedToken}. By default the provider will use cache.
	 *
	 * @param cached if the provider should cache access-tokens
	 * @return the builder
	 */
	@SuppressWarnings("unchecked")
	public TokenProviderBuilder<T> cached(boolean cached) {
		this.cached = cached;
		if (!cached) {
			this.preemptiveRefresh = false;
		}
		return this;
	}

	public TokenProviderBuilder<T> clock(Clock clock) {
		this.clock = clock;

		return this;

	}

	/**
	 * Enable the cache specifying how much time should left on the token when returned (minimal time to live) by the cache and maximum wait (blocking) time for
	 * cache refresh.
	 * 
	 * @param minimumTimeToLiveLeft     minimum time to live units
	 * @param minimumTimeToLiveLeftUnit minimum time to live units
	 * @param refreshExpiresIn          cache refresh timeout
	 * @param refreshExpiresInUnit      cache refresh timeout unit
	 * @return the builder
	 */

	@SuppressWarnings("unchecked")
	public TokenProviderBuilder<T> cached(long minimumTimeToLiveLeft, TimeUnit minimumTimeToLiveLeftUnit, long refreshExpiresIn,
			TimeUnit refreshExpiresInUnit) {
		this.cached = true;
		this.minimumTimeToLiveUnits = minimumTimeToLiveLeft;
		this.minimumTimeToLiveUnit = minimumTimeToLiveLeftUnit;
		this.refreshExpiresIn = refreshExpiresIn;
		this.refreshExpiresUnit = refreshExpiresInUnit;
		return this;
	}

	/**
	 * Enable the preemptive cache refresh. This also enables caching.
	 *
	 * @param timeout Preemptive timeout, relative to cache time to live, i.e. "15 seconds before timeout, refresh time cached value".
	 * @param unit    unit of preemptive timeout
	 * @return the builder
	 */
	@SuppressWarnings("unchecked")
	public TokenProviderBuilder<T> preemptiveCacheRefresh(long timeout, TimeUnit unit, int percent, IdlingResource preemptiveRefreshIdlingResource) {
		this.cached = true;
		this.preemptiveRefresh = true;
		this.preemptiveRefreshTimeUnits = timeout;
		this.preemptiveRefreshTimeUnit = unit;
		this.preemptiveRefreshIdlingResource = preemptiveRefreshIdlingResource;
		this.preemptiveRefreshPercent = percent;
		return this;
	}

	/**
	 * Enable the preemptive cache refresh. This also enables caching.
	 *
	 * @param idlingResource idleing resource for running preemptive token updates
	 * @return the builder
	 */
	@SuppressWarnings("unchecked")
	public TokenProviderBuilder<T> preemptiveCacheRefresh(IdlingResource idlingResource) {
		this.cached = true;
		this.preemptiveRefresh = true;
		this.preemptiveRefreshIdlingResource = idlingResource;
		return this;
	}

	/**
	 * Enable the preemptive cache. This also enables caching.
	 *
	 * @param preemptive if true, preemptive caching is active
	 * @return the builder
	 */
	@SuppressWarnings("unchecked")
	public TokenProviderBuilder<T> preemptiveCacheRefresh(boolean preemptive) {
		if (preemptive) {
			this.cached = true;
		}
		this.preemptiveRefresh = preemptive;
		return this;
	}

	public TokenProvider<T> build() {
		if (!cached && preemptiveRefresh) {
			throw new TokenProviderBuilderException("Premptive cache refresh configured without caching");
		}
		if (tokenRenewer == null) {
			throw new IllegalStateException();
		}

		TokenProvider<T> provider = new RenewingTokenProvider<>(tokenFactory, minimumTimeToLiveUnit.toMillis(minimumTimeToLiveUnits), tokenRenewer);

		if (retrying) {
			provider = new RetryingTokenProvider<>(provider);
		}
		if (preemptiveRefresh) {
			if (clock == null) {
				throw new TokenProviderBuilderException("Please supply time provider");
			}
			if (preemptiveRefreshIdlingResource == null) {
				throw new TokenProviderBuilderException("Please supply an idling resource for preemptive renewal");
			}
			if (preemptiveRefreshPercent < 0 || preemptiveRefreshPercent > 100) {
				throw new TokenProviderBuilderException("Please supply preemptive refresh as percent of token lifetime parameter");
			}
			provider = new PreemptiveRenewTokenProvider<>(provider, clock, minimumTimeToLiveUnits, minimumTimeToLiveUnit, refreshExpiresIn, refreshExpiresUnit,
					preemptiveRefreshTimeUnits, preemptiveRefreshTimeUnit, preemptiveRefreshPercent, preemptiveRefreshIdlingResource);
		}

		return provider;
	}

	@SuppressWarnings("unchecked")
	public TokenProviderBuilder<T> retrying(boolean retrying) {
		this.retrying = retrying;

		return this;
	}
}
