import React from 'react';
import {SvgProps} from 'react-native-svg';
import {View} from 'react-native';
import {IconText} from '@atb/mobility/components/IconText';
import {ThemeText} from '@atb/components/text';

type Props = {
  svg?(props: SvgProps): JSX.Element;
  primaryStat: string | number;
  secondaryStat?: string | number;
};
export const VehicleStat = ({svg, primaryStat, secondaryStat}: Props) => (
  <View style={{alignItems: 'center'}}>
    <IconText svg={svg} text={String(primaryStat)} />
    {secondaryStat && (
      <ThemeText type={'body__secondary'}>{secondaryStat}</ThemeText>
    )}
  </View>
);
