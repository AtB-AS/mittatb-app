import {CustomScreenParams} from '@atb/stacks-hierarchy/navigation-types';
import {
  StackNavigationOptions,
  TransitionPreset,
} from '@react-navigation/stack';

/**
 * This utility method should be set on every stack navigator, as it adds
 * handling that makes it possible to specify transition when navigating to
 * another screen.
 */
export const screenOptions: (
  defaultTransitionPreset: TransitionPreset,
  stackNavigationOptions?: StackNavigationOptions,
) => (props: {
  route: {params?: CustomScreenParams};
}) => StackNavigationOptions =
  (defaultTransitionPreset, stackNavigationOptions) =>
  ({route}) => ({
    ...stackNavigationOptions,
    ...(route.params?.transitionPreset ?? defaultTransitionPreset),
  });
