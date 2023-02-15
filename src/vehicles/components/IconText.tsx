import React from 'react';
import {SvgProps} from 'react-native-svg';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';

type Props = {
  svg?(props: SvgProps): JSX.Element;
  text: string;
};
export const IconText = ({svg, text}: Props) => (
  <View style={{flexDirection: 'row'}}>
    {svg && <ThemeIcon svg={svg} />}
    <ThemeText type="body__primary--bold">{text}</ThemeText>
  </View>
);
