import React, {Children, PropsWithChildren} from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';

type Props = PropsWithChildren<
  SectionItemProps<{
    accessibility?: AccessibilityProps;
    style?: StyleProp<ViewStyle>;
  }>
>;
export function GenericSectionItem({children, accessibility, ...props}: Props) {
  const {topContainer} = useSectionItem(props);
  const style = useSectionStyle();

  return (
    <View style={[topContainer, props.style]} {...accessibility}>
      {Children.map(children, (child) =>
        !!child ? <View style={style.spaceBetween}>{child}</View> : null,
      )}
    </View>
  );
}
