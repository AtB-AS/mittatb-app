import {useEffect, useState} from 'react';
import {RefreshControlProps} from 'react-native';

/**
 * Hook to manage the refreshing state of a pull-to-refresh control, ensuring
 * that the refreshing indicator is only shown when the user initiates a
 * pull-to-refresh and not when the refresh is triggered programmatically.
 */
export function useUserRefreshControlProps({
  onRefresh,
  refreshing,
}: {
  onRefresh: () => void;
  refreshing: boolean;
}): RefreshControlProps {
  const [isUserRefreshing, setIsUserRefreshing] = useState(false);

  useEffect(() => {
    if (refreshing && isUserRefreshing) setIsUserRefreshing(false);
  }, [refreshing, isUserRefreshing]);

  return {
    refreshing: refreshing && isUserRefreshing,
    onRefresh: () => {
      setIsUserRefreshing(true);
      onRefresh();
    },
  };
}
