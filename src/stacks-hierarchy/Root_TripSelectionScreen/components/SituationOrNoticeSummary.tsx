import {Statuses, StyleSheet, useThemeContext} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {statusTypeToIcon} from '@atb/utils/status-type-to-icon';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';

type Props = {
  statusType: Statuses;
  text?: string;
  key?: string;
};

export function SituationOrNoticeSummary({statusType, text, key}: Props) {
  const {themeName} = useThemeContext();
  const styles = useStyles();
  if (!text) return null;
  return (
    <View style={styles.container} key={key}>
      <ThemeIcon svg={statusTypeToIcon(statusType, true, themeName)} />
      <ThemeText typography="body__secondary">{text}</ThemeText>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      flexDirection: 'row',
      columnGap: theme.spacing.small,
    },
  };
});
