import {useAuthState} from '@atb/auth';
import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {StyleSheet} from '@atb/theme';
import {
  FareContract,
  filterMyExpiredFareContracts,
  filterSentFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {useTimeContextState} from '@atb/time';
import {
  TicketingTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {View} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';

type Mode = 'expired' | 'sent';

type Props = {mode: Mode};

export const TicketHistoryScreenComponent = ({mode}: Props) => {
  const {
    fareContracts,
    isRefreshingFareContracts,
    rejectedReservations,
    resubscribeFirestoreListeners,
  } = useTicketingState();

  const {serverNow} = useTimeContextState();
  const {abtCustomerId} = useAuthState();

  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <FullScreenView
      headerProps={{
        title: getTitle(mode, t),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={getTitle(mode, t)} />
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
          emptyStateTitleText={t(
            TicketingTexts.activeFareProductsAndReservationsTab
              .emptyTicketHistoryTitle,
          )}
          emptyStateDetailsText={t(
            TicketingTexts.activeFareProductsAndReservationsTab
              .emptyTicketHistoryDetails,
          )}
        />
      </View>
    </FullScreenView>
  );
};

const getTitle = (mode: Mode, t: TranslateFunction) => {
  switch (mode) {
    case 'expired':
      return t(TicketingTexts.expiredTickets.title);
    case 'sent':
      return t(TicketingTexts.sentToOthers.title);
  }
};

const displayFareContracts = (
  mode: Mode,
  fareContracts: FareContract[],
  serverNow: number,
  abtCustomerId?: string,
) => {
  switch (mode) {
    case 'expired':
      return abtCustomerId
        ? filterMyExpiredFareContracts(fareContracts, serverNow, abtCustomerId)
        : [];
    case 'sent':
      return abtCustomerId
        ? filterSentFareContracts(fareContracts, abtCustomerId)
        : [];
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
    padding: theme.spacings.medium,
  },
}));
