import {Button} from '@atb/components/button';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {CompactFareContractInfo} from '@atb/fare-contracts/CompactFareContractInfo';
import {getFareContractInfoDetails} from '@atb/fare-contracts/FareContractInfo';
import {StyleSheet, useTheme} from '@atb/theme';
import {useValidRightNowFareContract} from '@atb/ticketing';
import {
  DashboardTexts,
  TicketingTexts,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {useTimeContextState} from '@atb/time';
import {ContentHeading} from '@atb/components/heading';

type Props = {
  onPressDetails?: (orderId: string) => void;
  onPressBuy(): void;
  style?: ViewStyle;
};

export const CompactFareContracts: React.FC<Props> = ({
  onPressDetails,
  onPressBuy,
  style,
}) => {
  const itemStyle = useStyles();

  const {serverNow} = useTimeContextState();
  const validFareContracts = useValidRightNowFareContract();

  const {t} = useTranslation();
  const {theme} = useTheme();
  const {tariffZones, userProfiles, preassignedFareProducts} =
    useFirestoreConfiguration();

  return (
    <View style={[style, itemStyle.container]}>
      <ContentHeading
        color={theme.color.background.accent[0]}
        text={t(TicketingTexts.header.title)}
      />
      {validFareContracts.length == 0 ? (
        <Button
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
              tariffZones,
              userProfiles,
              preassignedFareProducts,
            );
            return (
              <CompactFareContractInfo
                key={fareContract.id}
                {...fareContractInfoDetailsProps}
                now={serverNow}
                onPressDetails={() => {
                  onPressDetails?.(fareContract.orderId);
                }}
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
