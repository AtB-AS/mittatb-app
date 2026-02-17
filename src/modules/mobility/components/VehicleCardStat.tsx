import React from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {SvgProps} from 'react-native-svg';

type Props = {
  icon: (SvgProps: SvgProps) => React.JSX.Element;
  stat: string;
  description: string;
  hasPriceAdjustment?: boolean;
};

export const VehicleCardStat = ({
  stat,
  description,
  icon,
  hasPriceAdjustment = false,
}: Props) => {
  const styles = useStyles();
  const {theme} = useThemeContext();

  return (
    <View
      style={
        hasPriceAdjustment
          ? [
              styles.contentItem,
              {backgroundColor: theme.color.status.valid.secondary.background},
            ]
          : styles.contentItem
      }
    >
      <ThemeIcon svg={icon} color="primary" size="large" />
      <View>
        <ThemeText typography="body__m__strong" color="primary">
          {stat}
        </ThemeText>
        <ThemeText typography="body__s" color="secondary">
          {description}
        </ThemeText>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    contentItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
      padding: theme.spacing.small,
      borderRadius: theme.border.radius.small,
    },
  };
});
