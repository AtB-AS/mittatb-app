import {Button} from '@atb/components/button';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {CompactFareContractInfo} from '@atb/modules/fare-contracts';
import {getFareContractInfoDetails} from '@atb/modules/fare-contracts';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  DashboardTexts,
  TicketingTexts,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useTimeContext} from '@atb/modules/time';
import {ContentHeading} from '@atb/components/heading';
import {useFareContracts} from '@atb/modules/ticketing';

type Props = {
  onPressDetails: (fareContractId: string) => void;
  onPressBuy: () => void;
  style?: ViewStyle;
};

export const CompactFareContracts: React.FC<Props> = ({
  onPressDetails,
  onPressBuy,
  style,
}) => {
  const itemStyle = useStyles();

  const {serverNow} = useTimeContext();
  const {fareContracts: validFareContracts} = useFareContracts(
    {availability: 'available', status: 'valid'},
    serverNow,
  );

  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const {fareZones, userProfiles, preassignedFareProducts} =
    useFirestoreConfigurationContext();

  return (
    <View style={[style, itemStyle.container]}>
      <ContentHeading
        color={theme.color.background.accent[0]}
        text={t(TicketingTexts.header.title)}
      />
      {validFareContracts.length == 0 ? (
        <Button
          expanded={true}
          text={t(DashboardTexts.buyButton)}
          onPress={onPressBuy}
          testID="buyTicketsButton"
        />
      ) : (
        <View style={itemStyle.fareContracts}>
          {validFareContracts.map((fareContract, index) => {
            const fareContractInfoDetailsProps = getFareContractInfoDetails(
              fareContract,
              serverNow,
              fareZones,
              userProfiles,
              preassignedFareProducts,
            );
            return (
              <CompactFareContractInfo
                key={fareContract.id}
                {...fareContractInfoDetailsProps}
                now={serverNow}
                onPressDetails={() => onPressDetails(fareContract.id)}
                testID={'fareContract' + index}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
  fareContracts: {
    rowGap: theme.spacing.medium,
  },
}));
