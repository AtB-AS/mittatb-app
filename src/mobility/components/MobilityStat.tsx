import React from 'react';
import {SvgProps} from 'react-native-svg';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';

export type MobilityStatProps = {
  svg?(props: SvgProps): JSX.Element;
  style?: StyleProp<ViewStyle>;
  primaryStat: string | number;
  secondaryStat?: string | number;
  secondaryStatStyle?: TextStyle;
};

export const MobilityStat = ({
  svg,
  style,
  primaryStat,
  secondaryStat,
  secondaryStatStyle,
}: MobilityStatProps) => (
  <View style={style}>
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
  const styles = useSheetStyle();
  const {theme} = useTheme();
  return (
    <View style={styles.statWithIcon}>
      {svg && (
        <ThemeIcon
          svg={svg}
          color={theme.text.colors.secondary}
          fill={theme.text.colors.secondary}
          style={styles.statIcon}
        />
      )}
      <ThemeText
        type="body__secondary--bold"
        color="secondary"
      >
        {text}
      </ThemeText>
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    statWithIcon: {
      flexDirection: 'row',
    },
    statIcon: {
      marginRight: theme.spacings.small,
    },
  };
});
