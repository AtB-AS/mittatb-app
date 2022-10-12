import {View} from 'react-native';
import {getTransportationModes} from '@atb/screens/Ticketing/FareContracts/utils';
import TransportationIcon from '@atb/components/transportation-icon';
import ThemeText from '@atb/components/text';
import {TicketsTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {PreassignedFareProductType} from '@atb/reference-data/types';
import {StyleSheet, Theme} from '@atb/theme';

const TransportMode = ({
  fareProductType,
  iconSize,
  disabled,
}: {
  fareProductType: PreassignedFareProductType | 'summerPass';
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.transportationMode}>
      {getTransportationModes(fareProductType)?.map((mode: any) => (
        <TransportationIcon
          key={mode}
          mode={mode.mode}
          subMode={mode.subMode}
          size={iconSize}
          disabled={disabled}
        />
      ))}
      <ThemeText type="label__uppercase" color={'secondary'}>
        {t(TicketsTexts.availableFareProducts[fareProductType].transportModes)}
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
