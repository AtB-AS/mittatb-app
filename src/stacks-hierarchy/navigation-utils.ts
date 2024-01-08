import {TransitionPresetParam} from '@atb/stacks-hierarchy/navigation-types';
import {TransitionPreset, TransitionPresets} from '@react-navigation/stack';

export const transitionOptions: (
  defaultTransitionPreset?: TransitionPreset,
) => (props: {route: {params?: TransitionPresetParam}}) => TransitionPreset =
  (defaultTransitionPreset = TransitionPresets.SlideFromRightIOS) =>
  ({route}) => ({
    ...(route.params?.transitionPreset ?? defaultTransitionPreset),
  });
