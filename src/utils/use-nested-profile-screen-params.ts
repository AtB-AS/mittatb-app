import {ProfileStackParams} from '@atb/stacks-hierarchy';
import {NavigatorScreenParams} from '@react-navigation/native';
import {useMemo} from 'react';

/**
 * This hook provides the params to navigate directly to a profile screen
 * with the proper navigation stack in place. It ensures that the back button behaves
 * naturally, taking users back to the Profile_RootScreen.
 *
 * When the target screen is nested below other profile screens, pass those
 * intermediate screens as `parentScreens` (in order, closest to the root first)
 * so the back button follows the natural hierarchy. Use a reference-stable array
 * (e.g. a module-level constant) to keep the returned params stable.
 */
export const useNestedProfileScreenParams = <
  T extends keyof ProfileStackParams,
>(
  screenName: T,
  screenParams?: ProfileStackParams[T],
  parentScreens?: (keyof ProfileStackParams)[],
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
                ...(parentScreens ?? []).map((name) => ({name})),
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
    [screenName, screenParams, parentScreens],
  );
};
