import React, {PropsWithChildren} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

export type GenericClickableItemProps = PropsWithChildren<
  SectionItem<{
    accessibility?: AccessibilityProps;
    onPress?(): void;
  }>
>;
export default function GenericClickableItem({
  children,
  accessibility,
  onPress,
  ...props
}: GenericClickableItemProps) {
  const {topContainer} = useSectionItem(props);
  const style = useSectionStyle();

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={topContainer} {...accessibility}>
        {children}
      </View>
    </TouchableOpacity>
  );
}
