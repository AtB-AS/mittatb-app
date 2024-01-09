import {CustomScreenParams} from '@atb/stacks-hierarchy/navigation-types';
import {
  StackNavigationOptions,
  TransitionPreset,
} from '@react-navigation/stack';

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
