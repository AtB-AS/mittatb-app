import {View} from 'react-native';
import TransportationIcon from '@atb/components/transportation-icon';
import ThemeText from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {Mode} from '@atb/api/types/generated/journey_planner_v3_types';

const TransportMode = ({
  modes,
  iconSize,
  disabled,
}: {
  modes: Mode[];
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.transportationMode}>
      {modes.map((mode: Mode) => (
        <TransportationIcon
          key={mode}
          mode={mode}
          size={iconSize}
          disabled={disabled}
        />
      ))}
      <ThemeText type="label__uppercase" color={'secondary'}>
        {modes.map((tm) => t(FareContractTexts.transportMode(tm))).join('/')}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationMode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default TransportMode;
