import {CustomScreenParams} from '@atb/stacks-hierarchy/navigation-types';
import {
  StackNavigationOptions,
  TransitionPreset,
  TransitionPresets,
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
    ...getTransitionPreset(route.params, defaultTransitionPreset),
  });

const getTransitionPreset = (
  params: CustomScreenParams | undefined,
  defaultTransitionPreset: TransitionPreset,
) => {
  if (!params?.transitionOverride) return defaultTransitionPreset;

  switch (params.transitionOverride) {
    case 'slide-from-bottom':
      return TransitionPresets.ModalSlideFromBottomIOS;
    case 'slide-from-right':
      return TransitionPresets.SlideFromRightIOS;
  }
};
