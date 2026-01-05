import React from 'react';
import {SvgProps} from 'react-native-svg';
import {StyleProp, View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';

export type MobilityStatProps = {
  svg?(props: SvgProps): React.JSX.Element;
  style?: StyleProp<ViewStyle>;
  text: string;
};

export const MobilityStat = ({
  svg,
  style: externalStyle,
  text,
}: MobilityStatProps) => {
  const styles = useSheetStyle();
  return (
    <View style={[styles.container, externalStyle]}>
      <StatWithIcon svg={svg} text={text} />
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
      <ThemeText typography="body__s" color="secondary" isMarkdown={true}>
        {text}
      </ThemeText>
    </View>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
  },
  statWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    marginRight: theme.spacing.small,
  },
}));
