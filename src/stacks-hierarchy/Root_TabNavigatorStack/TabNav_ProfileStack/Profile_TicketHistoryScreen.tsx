import React from 'react';
import {View} from 'react-native';
import {useTranslation, TicketingTexts} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {filterExpiredFareContracts, useTicketingState} from '@atb/ticketing';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {FullScreenHeader} from '@atb/components/screen-header';
import TicketHistoryTexts from '@atb/translations/screens/subscreens/TicketHistory';
import {useTimeContextState} from '@atb/time';

export const Profile_TicketHistoryScreen: React.FC = () => {
  const {
    fareContracts,
    isRefreshingFareContracts,
    rejectedReservations,
    resubscribeFirestoreListeners,
  } = useTicketingState();

  const {now} = useTimeContextState();
  const expiredFareContracts = filterExpiredFareContracts(fareContracts, now);

  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketHistoryTexts.header)}
        leftButton={{type: 'back'}}
      />
      <FareContractAndReservationsList
        fareContracts={expiredFareContracts}
        reservations={rejectedReservations}
        isRefreshing={isRefreshingFareContracts}
        refresh={resubscribeFirestoreListeners}
        now={now}
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
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
}));
