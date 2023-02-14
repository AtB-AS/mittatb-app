import React from 'react';
import {View} from 'react-native';
import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {StyleSheet} from '@atb/theme';

type CheckedProps = {
  checked: boolean;
};

export const SavedCheckbox: React.FC<CheckedProps> = ({checked}) => {
  const styles = useStyles();
  return (
    <View
      style={[
        styles.saveCheckbox,
        checked ? styles.saveCheckboxChecked : styles.saveCheckboxDefault,
      ]}
    >
      {checked ? <Confirm fill="white"></Confirm> : null}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  saveCheckbox: {
    marginRight: theme.spacings.small,
    height: theme.spacings.large,
    width: theme.spacings.large,
    borderRadius: theme.border.radius.small,
    borderWidth: theme.border.width.medium,
    borderColor: theme.static.background.background_accent_3.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveCheckboxChecked: {
    backgroundColor: theme.static.background.background_accent_3.background,
  },
  saveCheckboxDefault: {
    backgroundColor: theme.static.background.background_0.background,
  },
}));
