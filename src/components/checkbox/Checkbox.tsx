import React from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';
import {Theme} from '@atb/theme/colors';

type CheckedProps = {
  checked: boolean;
  accessibility?: AccessibilityProps;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const getDefaultColor = (theme: Theme) => theme.color.background.neutral[0];
const getCheckedColor = (theme: Theme) => theme.color.background.accent[3];

export const Checkbox: React.FC<CheckedProps> = ({
  checked,
  style,
  accessibility,
  testID,
}) => {
  const styles = useStyles();
  return (
    <View
      accessibilityRole="checkbox"
      accessibilityState={{selected: checked}}
      {...accessibility}
      style={[
        style,
        styles.saveCheckbox,
        checked ? styles.saveCheckboxChecked : styles.saveCheckboxDefault,
      ]}
      testID={testID ? `${testID}Checkbox` : 'checkbox'}
    >
      {checked ? <Confirm fill="white" /> : null}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  saveCheckbox: {
    height: theme.spacing.large,
    width: theme.spacing.large,
    borderRadius: theme.border.radius.small,
    borderWidth: theme.border.width.medium,
    borderColor: getCheckedColor(theme).background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveCheckboxChecked: {
    backgroundColor: getCheckedColor(theme).background,
  },
  saveCheckboxDefault: {
    backgroundColor: getDefaultColor(theme).background,
  },
}));
