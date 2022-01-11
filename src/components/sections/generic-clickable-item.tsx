import React, {PropsWithChildren} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

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
