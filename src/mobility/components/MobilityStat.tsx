import React from 'react';
import {SvgProps} from 'react-native-svg';
import {TextStyle, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {useTheme} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';

export type MobilityStatProps = {
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
}: MobilityStatProps) => (
  <View style={{alignItems: 'flex-start'}}>
    <StatWithIcon svg={svg} text={String(primaryStat)} />
    {secondaryStat && (
      <ThemeText
        type="body__secondary"
        style={secondaryStatStyle}
        color="secondary"
      >
        {secondaryStat}
      </ThemeText>
    )}
  </View>
);

type StatWithIconProps = {
  svg?(props: SvgProps): JSX.Element;
  text: string;
};

export const StatWithIcon = ({svg, text}: StatWithIconProps) => {
  const {theme} = useTheme();
  return (
    <View style={{flexDirection: 'row'}}>
      {svg && (
        <ThemeIcon
          style={
            (text ?? '').length > 0
              ? {marginRight: theme.spacings.small}
              : undefined
          }
          svg={svg}
          color={theme.text.colors.secondary}
          fill={theme.text.colors.secondary}
        />
      )}
      <ThemeText type="body__secondary--bold" color="secondary">
        {text}
      </ThemeText>
    </View>
  );
};
