import React, {Children, PropsWithChildren} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

export type GenericItemProps = PropsWithChildren<
  SectionItem<{
    accessibility?: AccessibilityProps;
  }>
>;
export default function GenericItem({
  children,
  accessibility,
  ...props
}: GenericItemProps) {
  const {topContainer} = useSectionItem(props);
  const style = useSectionStyle();

  return (
    <View style={topContainer} {...accessibility}>
      {Children.map(children, (child) => (
        <View style={style.spaceBetween}>{child}</View>
      ))}
    </View>
  );
}
