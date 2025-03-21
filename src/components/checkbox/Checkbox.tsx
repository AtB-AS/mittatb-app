import React from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Theme} from '@atb/theme/colors';
import SvgCheckboxChecked from '@atb/assets/svg/color/icons/input/CheckboxChecked';

type CheckedProps = {
  checked: boolean;
  accessibility?: AccessibilityProps;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const getDefaultColor = (theme: Theme) => theme.color.background.neutral[0];
const getCheckedColor = (theme: Theme) =>
  theme.color.interactive[2].outline.background;

export const Checkbox: React.FC<CheckedProps> = ({
  checked,
  style,
  accessibility,
  testID,
}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  return (
    <View
      accessibilityRole="checkbox"
      accessibilityState={{selected: checked}}
      {...accessibility}
      style={[style, styles.saveCheckbox, styles.saveCheckboxDefault]}
      testID={testID ? `${testID}Checkbox` : 'checkbox'}
    >
      {checked ? (
        <SvgCheckboxChecked fill="white" width={theme.icon.size.normal} />
      ) : null}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  saveCheckbox: {
    height: theme.spacing.large,
    width: theme.spacing.large,
    borderRadius: theme.border.radius.small,
    borderWidth: theme.border.width.medium,
    borderColor: getCheckedColor(theme),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveCheckboxDefault: {
    backgroundColor: getDefaultColor(theme).background,
  },
}));
