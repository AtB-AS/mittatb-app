import {StyleSheet, useTheme} from '@atb/theme';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';

export const CollapsedLegs = ({legs}: {legs: any[]}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const backgroundColor = theme.static.transport.transport_other.background;

  if (!legs.length) return null;

  return (
    <View style={[styles.transportationIcon, {backgroundColor}]}>
      <ThemeText
        color={'transport_other'}
        type="body__primary--bold"
        testID="collapsedLegs"
      >
        +{legs.length}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationIcon: {
    paddingVertical: theme.spacings.small,
    paddingHorizontal: theme.spacings.small,
    borderRadius: theme.border.radius.small,
    marginRight: theme.spacings.small,
  },
}));
