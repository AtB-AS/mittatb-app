import React from 'react';
import {SvgProps} from 'react-native-svg';
import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';

export type MobilityStatProps = {
  svg?(props: SvgProps): React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  primaryStat: string | number;
  secondaryStat?: string | number;
  secondaryStatStyle?: TextStyle;
};

export const MobilityStat = ({
  svg,
  style: externalStyle,
  primaryStat,
  secondaryStat,
  secondaryStatStyle,
}: MobilityStatProps) => {
  const styles = useSheetStyle();
  return (
    <View style={[styles.container, externalStyle]}>
      <StatWithIcon svg={svg} text={String(primaryStat)} />
      {!!secondaryStat && (
        <ThemeText
          typography="body__s"
          style={secondaryStatStyle}
          color="secondary"
        >
          {secondaryStat}
        </ThemeText>
      )}
    </View>
  );
};

type StatWithIconProps = {
  svg?(props: SvgProps): React.JSX.Element;
  text: string;
};

export const StatWithIcon = ({svg, text}: StatWithIconProps) => {
  const styles = useSheetStyle();
  return (
    <View style={styles.statWithIcon}>
      {svg && <ThemeIcon svg={svg} color="secondary" style={styles.statIcon} />}
      <ThemeText typography="body__s__strong" color="secondary">
        {text}
      </ThemeText>
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
  },
  statWithIcon: {
    flexDirection: 'row',
  },
  statIcon: {
    marginRight: theme.spacing.small,
  },
}));
