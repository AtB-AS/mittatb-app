import React, {PropsWithChildren} from 'react';
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
export function GenericClickableSectionItem({children, ...props}: Props) {
  const {topContainer} = useSectionItem(props);

  return (
    <TouchableOpacity {...props}>
      <View style={topContainer}>{children}</View>
    </TouchableOpacity>
  );
}
