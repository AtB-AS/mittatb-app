import React, {Children, PropsWithChildren} from 'react';
import {AccessibilityProps, View} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';

type Props = PropsWithChildren<
  SectionItemProps<{
    accessibility?: AccessibilityProps;
  }>
>;
export function GenericSectionItem({children, accessibility, ...props}: Props) {
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
