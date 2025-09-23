import React from 'react';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ThemeText} from '@atb/components/text';
import {SvgProps} from 'react-native-svg';

type Props = {
  icon: (SvgProps: SvgProps) => React.JSX.Element;
  stat: string;
  description: string;
};

export const VehicleCardStat = ({stat, description, icon}: Props) => {
  const styles = useStyles();

  return (
    <View style={styles.contentItem}>
      <ThemeIcon svg={icon} color="primary" size="large" />
      <ThemeText typography="body__primary--bold" color="primary">
        {stat}
      </ThemeText>
      <ThemeText typography="body__secondary" color="secondary">
        {description}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    contentItem: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: theme.spacing.xSmall,
    },
  };
});
