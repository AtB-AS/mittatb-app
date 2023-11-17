import React from 'react';
import {SvgProps} from 'react-native-svg';
import {TextStyle, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {MobilityIconText} from '@atb/mobility/components/MobilityIconText';

type Props = {
  svg?(props: SvgProps): JSX.Element;
  primaryStat: string | number;
  secondaryStat?: string | number;
  secondaryStatStyle?: TextStyle;
};

export const MobilityStat = ({
  svg,
  primaryStat,
  secondaryStat,
  secondaryStatStyle,
}: Props) => (
  <View style={{alignItems: 'flex-start'}}>
    <MobilityIconText svg={svg} text={String(primaryStat)} />
    {secondaryStat && (
      <ThemeText
        type="body__secondary"
        style={secondaryStatStyle}
        color='secondary'
      >
        {secondaryStat}
      </ThemeText>
    )}
  </View>
);
