import React, {useState} from 'react';
import {View} from 'react-native';
import {useTranslation, TicketingTexts, dictionary} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {filterExpiredFareContracts, useTicketingState} from '@atb/ticketing';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {FullScreenHeader} from '@atb/components/screen-header';
import TicketHistoryTexts from '@atb/translations/screens/subscreens/TicketHistory';

export const Profile_TicketHistoryScreen: React.FC = () => {
  const {
    fareContracts,
    isRefreshingFareContracts,
    rejectedReservations,
    resubscribeFirestoreListeners,
  } = useTicketingState();

  const [now, setNow] = useState<number>(Date.now());
  const expiredFareContracts = filterExpiredFareContracts(fareContracts);

  const styles = useStyles();
  const {t} = useTranslation();
  const emptyTicketHistoryDetailsText = t(
    TicketingTexts.activeFareProductsAndReservationsTab.emptyTicketHistory
      .details,
  );
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
        refresh={() => {
          setNow(Date.now());
          resubscribeFirestoreListeners();
        }}
        now={now}
        emptyStateTitleText={t(
          TicketingTexts.activeFareProductsAndReservationsTab.emptyTicketHistory
            .title,
        )}
        emptyStateDetailsText={`${emptyTicketHistoryDetailsText} ${t(
          TicketingTexts.activeFareProductsAndReservationsTab.emptyTicketHistory
            .pullToRefresh,
        )}`}
        emptyStateDetailsA11yLabel={`${emptyTicketHistoryDetailsText} ${t(
          dictionary.a11yPullToRefresh,
        )}`}
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
