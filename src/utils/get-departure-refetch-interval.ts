import {ONE_SECOND_MS} from '@atb/utils/durations';

/**
 * Creates a refetchInterval function for React Query that calculates
 * the time until the next refetch based on when data was last updated.
 */
export const getDepartureRefetchInterval =
  (refetchIntervalSeconds: number) =>
  ({state: {dataUpdatedAt}}: {state: {dataUpdatedAt: number}}) => {
    // Skip refetchInterval until the first successful fetch
    if (!dataUpdatedAt) return false;

    const secondsSincePreviousFetch = (Date.now() - dataUpdatedAt) / 1000;
    const secondsUntilNextFetch =
      refetchIntervalSeconds - secondsSincePreviousFetch;

    return Math.max(secondsUntilNextFetch, 0) * ONE_SECOND_MS;
  };
