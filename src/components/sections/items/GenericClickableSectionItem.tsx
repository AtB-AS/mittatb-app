import React, {PropsWithChildren, forwardRef} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type Props = PropsWithChildren<
  SectionItemProps<
    {
      onPress?(): void;
      disabled?: boolean;
    } & AccessibilityProps
  >
>;

export const GenericClickableSectionItem = forwardRef<any, Props>(
  ({children, ...props}, focusRef) => {
    const {topContainer} = useSectionItem(props);

    return (
      <PressableOpacity
        {...props}
        ref={focusRef}
        style={props.disabled && {opacity: 0.5}}
      >
        <View style={topContainer}>{children}</View>
      </PressableOpacity>
    );
  },
);
