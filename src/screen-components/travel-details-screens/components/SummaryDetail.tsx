import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {View} from 'react-native';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {SvgProps} from 'react-native-svg';

type Props = {
  icon(props: SvgProps): React.JSX.Element;
  accessibilityLabel: string;
  label: string;
  testID?: string;
};
export const SummaryDetail = ({
  icon,
  accessibilityLabel,
  label,
  testID,
}: Props) => {
  const styles = useStyle();

  return (
    <View style={styles.summaryDetail}>
      <ThemeIcon color="secondary" style={styles.leftIcon} svg={icon} />
      <ThemeText
        color="secondary"
        accessible={true}
        style={styles.detailText}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
      >
        {label}
      </ThemeText>
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  detailText: {
    flex: 1,
  },
  summaryDetail: {
    padding: theme.spacing.medium,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftIcon: {
    marginRight: theme.spacing.small,
  },
}));
