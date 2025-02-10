import {StyleSheet} from '@atb/theme';
import {
  Reservation,
  useFareContracts,
  useTicketingContext,
} from '@atb/ticketing';
import {useTimeContext} from '@atb/time';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {
  TicketHistoryMode,
  TicketHistoryScreenParams,
} from '@atb/ticket-history';
import {TicketHistoryModeTexts} from '@atb/translations/screens/Ticketing';
import {useAuthContext} from '@atb/auth';
import {HoldingHands, TicketTilted} from '@atb/assets/svg/color/images';
import React from 'react';
import {FullScreenHeader} from '@atb/components/screen-header';
import {
  getFareContractInfo,
  useSortFcOrReservationByValidityAndCreation,
} from '@atb/fare-contracts/utils';
import {useAnalyticsContext} from '@atb/analytics';
import {FlatList} from 'react-native-gesture-handler';
import {FareContractOrReservation} from '@atb/fare-contracts/FareContractOrReservation';
import {EmptyState} from '@atb/components/empty-state';

type Props = TicketHistoryScreenParams & {
  onPressFareContract: (orderId: string) => void;
};

export const TicketHistoryScreenComponent = ({
  mode,
  onPressFareContract,
}: Props) => {
  const {sentFareContracts, reservations, rejectedReservations} =
    useTicketingContext();
  const {serverNow} = useTimeContext();
  const analytics = useAnalyticsContext();
  const {fareContracts: historicalFareContracts} = useFareContracts(
    {availability: 'historical'},
    serverNow,
  );
  const {abtCustomerId: customerAccountId} = useAuthContext();

  const {t} = useTranslation();
  const styles = useStyles();

  const fareContractsToShow =
    mode === 'sent' ? sentFareContracts : historicalFareContracts;
  const reservationsToShow = getReservationsToShow(
    mode,
    reservations,
    rejectedReservations,
    customerAccountId,
  );

  const sortedItems = useSortFcOrReservationByValidityAndCreation(
    serverNow,
    [...fareContractsToShow, ...reservationsToShow],
    (currentTime, fareContract, currentUserId) =>
      getFareContractInfo(currentTime, fareContract, currentUserId)
        .validityStatus,
  );

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketHistoryModeTexts[mode].title)}
        leftButton={{type: 'back', withIcon: true}}
      />
      <FlatList
        data={sortedItems}
        renderItem={({item, index}) => (
          <FareContractOrReservation
            now={serverNow}
            onPressFareContract={() => {
              analytics.logEvent('Ticketing', 'Ticket details clicked');
              onPressFareContract(item.orderId);
            }}
            fcOrReservation={item}
            index={index}
          />
        )}
        keyExtractor={(item) => item.created + item.orderId}
        ListEmptyComponent={
          <EmptyState
            title={t(TicketingTexts.ticketHistory.emptyState)}
            details={t(TicketHistoryModeTexts[mode].emptyDetail)}
            illustrationComponent={emptyStateImage(mode)}
            testID="fareContracts"
          />
        }
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const getReservationsToShow = (
  mode: TicketHistoryMode,
  reservations: Reservation[],
  rejectedReservations: Reservation[],
  customerAccountId?: string,
) => {
  switch (mode) {
    case 'historical':
      return rejectedReservations.filter(
        (reservation) => reservation.customerAccountId === customerAccountId,
      );
    case 'sent':
      return reservations.filter(
        (reservation) => reservation.customerAccountId !== customerAccountId,
      );
  }
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
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  flatListContent: {gap: theme.spacing.large, padding: theme.spacing.medium},
}));
