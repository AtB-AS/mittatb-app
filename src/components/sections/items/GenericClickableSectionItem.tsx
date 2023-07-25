import React, {PropsWithChildren, forwardRef} from 'react';
import {AccessibilityProps, TouchableOpacity, View} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';

type Props = PropsWithChildren<
  SectionItemProps<
    {
      onPress?(): void;
    } & AccessibilityProps
  >
>;
export const GenericClickableSectionItem = forwardRef<TouchableOpacity, Props>(
  ({children, ...props}, focusRef) => {
    const {topContainer} = useSectionItem(props);

    return (
      <TouchableOpacity {...props} ref={focusRef}>
        <View style={topContainer}>{children}</View>
      </TouchableOpacity>
    );
  },
);
