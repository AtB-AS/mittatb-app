import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {StyleSheet} from '@atb/theme';
import {
  FareContract,
  Reservation,
  filterExpiredFareContracts,
  useTicketingContext,
} from '@atb/ticketing';
import {useTimeContext} from '@atb/time';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import {
  TicketHistoryMode,
  TicketHistoryScreenParams,
} from '@atb/ticket-history';
import {TicketHistoryModeTexts} from '@atb/translations/screens/Ticketing';
import {useAuthContext} from '@atb/auth';

export const TicketHistoryScreenComponent = ({
  mode,
}: TicketHistoryScreenParams) => {
  const {
    fareContracts,
    sentFareContracts,
    isRefreshingFareContracts,
    reservations,
    rejectedReservations,
    resubscribeFirestoreListeners,
  } = useTicketingContext();

  const {abtCustomerId: customerAccountId} = useAuthContext();

  const {serverNow} = useTimeContext();
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <FullScreenView
      headerProps={{
        title: t(TicketHistoryModeTexts[mode].title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(TicketHistoryModeTexts[mode].title)}
        />
      )}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshingFareContracts}
          onRefresh={resubscribeFirestoreListeners}
        />
      }
    >
      <View style={styles.container}>
        <FareContractAndReservationsList
          fareContracts={displayFareContracts(
            mode,
            fareContracts,
            sentFareContracts,
            serverNow,
          )}
          reservations={displayReservations(
            mode,
            reservations,
            rejectedReservations,
            customerAccountId,
          )}
          now={serverNow}
          mode={mode}
          emptyStateTitleText={t(TicketingTexts.ticketHistory.emptyState)}
          emptyStateDetailsText={t(TicketHistoryModeTexts[mode].emptyDetail)}
        />
      </View>
    </FullScreenView>
  );
};

const displayFareContracts = (
  mode: TicketHistoryMode,
  fareContracts: FareContract[],
  sentFareContracts: FareContract[],
  serverNow: number,
) => {
  switch (mode) {
    case 'expired':
      return filterExpiredFareContracts(fareContracts, serverNow);
    case 'sent':
      return sentFareContracts;
  }
};

const displayReservations = (
  mode: TicketHistoryMode,
  reservations: Reservation[],
  rejectedReservations: Reservation[],
  customerAccountId?: string,
) => {
  switch (mode) {
    case 'expired':
      return rejectedReservations.filter(
        (reservation) => reservation.customerAccountId === customerAccountId,
      );
    case 'sent':
      return reservations.filter(
        (reservation) => reservation.customerAccountId !== customerAccountId,
      );
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
    padding: theme.spacing.medium,
  },
}));
