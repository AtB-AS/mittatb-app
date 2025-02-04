import React from 'react';
import {RootStackParamList} from '@atb/stacks-hierarchy';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {FareContract, Reservation, TravelCard} from '@atb/ticketing';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useAnalyticsContext} from '@atb/analytics';
import {HoldingHands, TicketTilted} from '@atb/assets/svg/color/images';
import {EmptyState} from '@atb/components/empty-state';
import {TicketHistoryMode} from '@atb/ticket-history';
import {useSortFcOrReservationByValidityAndCreation} from './utils';
import {getFareContractInfo} from './utils';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';

type RootNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  reservations?: Reservation[];
  fareContracts?: FareContract[];
  now: number;
  travelCard?: TravelCard;
  mode?: TicketHistoryMode;
  emptyStateTitleText: string;
  emptyStateDetailsText: string;
};

export const FareContractAndReservationsList: React.FC<Props> = ({
  fareContracts,
  reservations,
  now,
  mode = 'historical',
  emptyStateTitleText,
  emptyStateDetailsText,
}) => {
  const styles = useStyles();
  const navigation = useNavigation<RootNavigationProp>();
  const analytics = useAnalyticsContext();

  const fcOrReservations = [...(fareContracts || []), ...(reservations || [])];

  const fareContractsAndReservationsSorted =
    useSortFcOrReservationByValidityAndCreation(
      now,
      fcOrReservations,
      (currentTime, fareContract, currentUserId) =>
        getFareContractInfo(currentTime, fareContract, currentUserId)
          .validityStatus,
    );

  return (
    <View style={styles.container}>
      {!fareContractsAndReservationsSorted.length && (
        <EmptyState
          title={emptyStateTitleText}
          details={emptyStateDetailsText}
          illustrationComponent={emptyStateImage(mode)}
          testID="fareContracts"
        />
      )}
      {fareContractsAndReservationsSorted?.map((fcOrReservation, index) => (
        <FareContractOrReservation
          now={now}
          onPressFareContract={() => {
            analytics.logEvent('Ticketing', 'Ticket details clicked');
            navigation.navigate({
              name: 'Root_FareContractDetailsScreen',
              params: {
                orderId: fcOrReservation.orderId,
              },
            });
          }}
          key={fcOrReservation.orderId}
          fcOrReservation={fcOrReservation}
          index={index}
        />
      ))}
    </View>
  );
};

const emptyStateImage = (emptyStateMode: TicketHistoryMode) => {
  switch (emptyStateMode) {
    case 'historical':
      return <TicketTilted height={84} />;
    case 'sent':
      return <HoldingHands height={84} />;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.large,
  },
}));
