import {useEffect, useState} from 'react';
import {
  type NavigationProp,
  type ParamListBase,
} from '@react-navigation/native';
import {useAppStateStatus} from '@atb/utils/use-app-state-status';
import type {TabNavigatorStackParams} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/navigation-types';

const MAP_TAB_ROUTE_NAME: keyof TabNavigatorStackParams = 'TabNav_MapStack';

/**
 * Whether the Map tab is the focused bottom tab and the app is foregrounded,
 * regardless of how deep the user has navigated inside the Map stack.
 *
 * Unlike screen focus (`useIsFocusedAndActive`), the tab-focus part stays true
 * while pushing and popping subscreens within the Map tab, so the map's
 * vehicle/station layers don't unmount and re-mount mid slide-transition —
 * re-mounting them while the back-transition animates caused jank.
 */
export const useIsMapTabFocused = (
  navigation: NavigationProp<ParamListBase>,
): boolean => {
  const appStateStatus = useAppStateStatus();
  const [isTabFocused, setIsTabFocused] = useState(true);

  useEffect(() => {
    const tabNavigation = navigation.getParent<
      NavigationProp<ParamListBase> | undefined
    >();
    if (!tabNavigation) return;

    const update = () => {
      const state = tabNavigation.getState();
      setIsTabFocused(state.routes[state.index]?.name === MAP_TAB_ROUTE_NAME);
    };

    update();
    return tabNavigation.addListener('state', update);
  }, [navigation]);

  return isTabFocused && appStateStatus === 'active';
};
