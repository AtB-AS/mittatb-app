import {ProfileStackParams, RootNavigationProps} from '@atb/stacks-hierarchy';
import {NavigatorScreenParams, useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

/**
 * This hook provides a function to navigate directly to a profile screen
 * with the proper navigation stack in place. It ensures that the back button behaves
 * naturally, taking users back to the Profile_RootScreen.
 *
 * @returns {Function} A function that when called, navigates to the specified profile screen
 * with the correct navigation hierarchy.
 */
export const useNavigateNestedProfileScreen = <
  T extends keyof ProfileStackParams,
>(
  screenName: T,
  screenParams?: ProfileStackParams[T],
) => {
  const navigation = useNavigation<RootNavigationProps>();

  return useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', {
      screen: 'TabNav_ProfileStack',
      params: {
        screen: 'Profile_RootScreen',
      },
    });

    requestAnimationFrame(() =>
      navigation.navigate('Root_TabNavigatorStack', {
        screen: 'TabNav_ProfileStack',
        params: {
          screen: screenName,
          params: screenParams,
        } as NavigatorScreenParams<ProfileStackParams>,
      }),
    );
  }, [navigation, screenName, screenParams]);
};
