import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {StyleSheet} from '@atb/theme';
import {
  FareContract,
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

export const TicketHistoryScreenComponent = ({
  mode,
}: TicketHistoryScreenParams) => {
  const {
    fareContracts,
    isRefreshingFareContracts,
    rejectedReservations,
    resubscribeFirestoreListeners,
  } = useTicketingState();

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
          fareContracts={displayFareContracts(mode, fareContracts, serverNow)}
          reservations={rejectedReservations}
          now={serverNow}
          emptyStateMode={mode}
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
  serverNow: number,
) => {
  switch (mode) {
    case 'expired':
      return filterExpiredFareContracts(fareContracts, serverNow);
    case 'sent': // TODO replace with sent fare contracts
      return filterExpiredFareContracts(fareContracts, serverNow);
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
    padding: theme.spacings.medium,
  },
}));
