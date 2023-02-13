import {useIsFocused} from '@react-navigation/native';
import {differenceInSeconds} from 'date-fns';
import {useEffect} from 'react';

export function useRefreshOnFocus(
  lastUpdate: Date | undefined,
  hardRefreshLimitInSeconds: number,
  hardRefresh: () => void,
  softRefreshLimitInSeconds: number,
  softRefresh: () => void,
) {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused || !lastUpdate) return;
    const timeSinceLastTick = differenceInSeconds(Date.now(), lastUpdate);

    if (timeSinceLastTick >= hardRefreshLimitInSeconds) {
      hardRefresh();
    } else if (timeSinceLastTick >= softRefreshLimitInSeconds) {
      softRefresh();
    }
  }, [isFocused]);
}
