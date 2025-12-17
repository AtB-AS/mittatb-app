import {ProfileStackParams} from '@atb/stacks-hierarchy';
import {NavigatorScreenParams} from '@react-navigation/native';
import {useMemo} from 'react';

/**
 * This hook provides the params to navigate directly to a profile screen
 * with the proper navigation stack in place. It ensures that the back button behaves
 * naturally, taking users back to the Profile_RootScreen.
 */
export const useNestedProfileScreenParams = <
  T extends keyof ProfileStackParams,
>(
  screenName: T,
  screenParams?: ProfileStackParams[T],
) => {
  return useMemo(
    () => ({
      state: {
        routes: [
          {
            name: 'TabNav_ProfileStack',
            state: {
              routes: [
                {name: 'Profile_RootScreen'},
                {
                  name: screenName,
                  params:
                    screenParams as NavigatorScreenParams<ProfileStackParams>,
                },
              ],
            },
          },
        ],
      },
    }),
    [screenName, screenParams],
  );
};
