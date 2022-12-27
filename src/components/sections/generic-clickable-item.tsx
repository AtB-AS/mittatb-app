import React, {PropsWithChildren} from 'react';
import {AccessibilityProps, TouchableOpacity, View} from 'react-native';
import {SectionItem, useSectionItem} from './section-utils';

export type GenericClickableItemProps = PropsWithChildren<
  SectionItem<
    {
      onPress?(): void;
    } & AccessibilityProps
  >
>;
export default function GenericClickableItem({
  children,
  ...props
}: GenericClickableItemProps) {
  const {topContainer} = useSectionItem(props);

  return (
    <TouchableOpacity {...props}>
      <View style={topContainer}>{children}</View>
    </TouchableOpacity>
  );
}
