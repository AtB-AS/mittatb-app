import React, {PropsWithChildren, forwardRef} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {
  PressableOpacity,
  PressableOpacityProps,
} from '@atb/components/pressable-opacity';

type Props = PropsWithChildren<
  SectionItemProps<
    {
      onPress?(): void;
    } & AccessibilityProps &
      PressableOpacityProps
  >
>;

export const GenericClickableSectionItem = forwardRef<any, Props>(
  ({children, ...props}, focusRef) => {
    const {topContainer} = useSectionItem(props);

    return (
      <PressableOpacity {...props} ref={focusRef}>
        <View style={topContainer}>{children}</View>
      </PressableOpacity>
    );
  },
);
