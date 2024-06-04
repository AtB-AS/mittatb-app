import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {StyleSheet} from '@atb/theme';
import {
  FareContract,
  Reservation,
  filterExpiredFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {useTimeContextState} from '@atb/time';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import {
  TicketHistoryMode,
  TicketHistoryScreenParams,
} from '@atb/ticket-history';
import {TicketHistoryModeTexts} from '@atb/translations/screens/Ticketing';
import {useAuthState} from '@atb/auth';

export const TicketHistoryScreenComponent = ({
  mode,
}: TicketHistoryScreenParams) => {
  const {
    fareContracts,
    sentFareContracts,
    isRefreshingFareContracts,
    rejectedReservations,
    resubscribeFirestoreListeners,
  } = useTicketingState();

  const {abtCustomerId: customerAccountId} = useAuthState();

  const {serverNow} = useTimeContextState();
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
  customerAccountId?: string,
) => {
  switch (mode) {
    case 'expired':
      return reservations.filter(
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
    backgroundColor: theme.static.background.background_1.background,
    padding: theme.spacings.medium,
  },
}));
