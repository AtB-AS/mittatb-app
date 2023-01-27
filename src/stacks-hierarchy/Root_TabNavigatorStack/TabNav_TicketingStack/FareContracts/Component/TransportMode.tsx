import {View} from 'react-native';
import {TransportationIcon} from '@atb/components/transportation-icon';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {TransportModeType} from '@atb/configuration/types';

const TransportMode = ({
  modes,
  iconSize,
  disabled,
}: {
  modes: TransportModeType[];
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.transportationMode}>
      {modes.map(({mode, subMode}) => (
        <TransportationIcon
          key={mode + subMode}
          mode={mode}
          subMode={subMode}
          size={iconSize}
          disabled={disabled}
        />
      ))}
      <ThemeText type="label__uppercase" color={'secondary'}>
        {modes
          .map((tm) => t(FareContractTexts.transportMode(tm.mode)))
          .join('/')}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  transportationMode: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}));

export default TransportMode;
