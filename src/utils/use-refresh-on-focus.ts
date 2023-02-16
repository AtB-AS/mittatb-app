import {differenceInSeconds} from 'date-fns';
import {useEffect} from 'react';

export function useRefreshOnFocus(
  isFocused: boolean,
  lastUpdate: Date | undefined,
  hardRefreshLimitInSeconds: number,
  hardRefresh: () => void,
  softRefresh: () => void,
) {
  useEffect(() => {
    if (!isFocused || !lastUpdate) return;
    const timeSinceLastTick = differenceInSeconds(Date.now(), lastUpdate);

    if (timeSinceLastTick >= hardRefreshLimitInSeconds) {
      hardRefresh();
    } else {
      softRefresh();
    }
  }, [isFocused, hardRefreshLimitInSeconds, hardRefresh, softRefresh]);
}
