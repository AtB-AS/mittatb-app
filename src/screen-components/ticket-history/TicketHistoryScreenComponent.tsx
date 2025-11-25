import {StyleSheet} from '@atb/theme';
import {
  Reservation,
  useFareContracts,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {useTimeContext} from '@atb/modules/time';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {TicketHistoryMode, TicketHistoryScreenParams} from './types';
import {TicketHistoryModeTexts} from '@atb/translations/screens/Ticketing';
import {useAuthContext} from '@atb/modules/auth';
import React from 'react';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {FlatList} from 'react-native-gesture-handler';
import {FareContractOrReservation} from '@atb/modules/fare-contracts';
import {EmptyState} from '@atb/components/empty-state';
import {ThemedHoldingHands, ThemedTicketTilted} from '@atb/theme/ThemedAssets';
import {sortFcOrReservationByCreation} from '@atb/modules/fare-contracts';

type Props = TicketHistoryScreenParams & {
  onPressFareContract: (fareContractId: string) => void;
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

  const sortedItems = sortFcOrReservationByCreation([
    ...fareContractsToShow,
    ...reservationsToShow,
  ]);

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketHistoryModeTexts[mode].title)}
        leftButton={{type: 'back'}}
      />
      <FlatList
        data={sortedItems}
        renderItem={({item, index}) => (
          <FareContractOrReservation
            now={serverNow}
            onPressFareContract={() => {
              // Reservations don't have `id`, but also don't show the link to
              // ticket details.
              if ('id' in item) {
                analytics.logEvent('Ticketing', 'Ticket details clicked');
                onPressFareContract(item.id);
              }
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
        testID="ticketHistoryScrollView"
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
      return <ThemedTicketTilted height={84} />;
    case 'sent':
      return <ThemedHoldingHands height={84} />;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
  },
  flatListContent: {gap: theme.spacing.large, padding: theme.spacing.medium},
}));
