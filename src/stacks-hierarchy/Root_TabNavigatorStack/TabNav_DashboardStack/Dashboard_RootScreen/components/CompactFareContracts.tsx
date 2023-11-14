import {Button} from '@atb/components/button';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {CompactFareContractInfo} from '@atb/fare-contracts/CompactFareContractInfo';
import {getFareContractInfoDetails} from '@atb/fare-contracts/FareContractInfo';
import {StyleSheet} from '@atb/theme';
import {
  filterValidRightNowFareContract,
  useTicketingState,
} from '@atb/ticketing';
import {
  DashboardTexts,
  TicketingTexts,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {SectionHeading} from './SectionHeading';
import {useTimeContextState} from '@atb/time';

type Props = {
  onPressDetails?: (isCarnet: boolean, orderId: string) => void;
  onPressBuy(): void;
  style?: ViewStyle;
};

export const CompactFareContracts: React.FC<Props> = ({
  onPressDetails,
  onPressBuy,
  style,
}) => {
  const itemStyle = useStyles();

  const {now} = useTimeContextState();
  const {fareContracts} = useTicketingState();
  const validFareContracts = filterValidRightNowFareContract(
    fareContracts,
    now,
  );

  const {t} = useTranslation();
  const {tariffZones, userProfiles, preassignedFareProducts} =
    useFirestoreConfiguration();

  return (
    <View style={style}>
      <SectionHeading accessibilityLabel={t(TicketingTexts.header.title)}>
        {t(TicketingTexts.header.title)}
      </SectionHeading>
      {validFareContracts.length == 0 ? (
        <Button
          text={t(DashboardTexts.buyButton)}
          onPress={onPressBuy}
          testID="buyTicketsButton"
        />
      ) : (
        validFareContracts.map((fareContract, index) => {
          const fareContractInfoDetailsProps = getFareContractInfoDetails(
            fareContract,
            now,
            tariffZones,
            userProfiles,
            preassignedFareProducts,
          );
          return (
            <CompactFareContractInfo
              style={{
                ...itemStyle.fareContract,
                ...(index === validFareContracts.length - 1
                  ? itemStyle.fareContract__last
                  : {}),
              }}
              key={fareContract.id}
              {...fareContractInfoDetailsProps}
              now={now}
              onPressDetails={() => {
                onPressDetails?.(
                  fareContractInfoDetailsProps.isCarnetFareContract ?? false,
                  fareContract.orderId,
                );
              }}
              testID={'fareContract' + index}
            />
          );
        })
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  fareContract: {
    marginBottom: theme.spacings.small,
  },
  fareContract__last: {
    marginBottom: 0,
  },
}));
