import React, {useState} from 'react';
import {View} from 'react-native';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {filterExpiredFareContracts, useTicketingState} from '@atb/ticketing';
import FareContractAndReservationsScrollView from '@atb/screens/Ticketing/FareContracts/FareContractAndReservationsScrollView';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import TicketHistoryTexts from '@atb/translations/screens/subscreens/TicketHistory';

export const TicketHistory: React.FC = () => {
  const {fareContracts, isRefreshingFareContracts, rejectedReservations} =
    useTicketingState();

  const [now, setNow] = useState<number>(Date.now());
  const expiredFareContracts = filterExpiredFareContracts(fareContracts);

  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(TicketHistoryTexts.header)}
        leftButton={{type: 'back'}}
      />
      <FareContractAndReservationsScrollView
        fareContracts={expiredFareContracts}
        reservations={rejectedReservations}
        isRefreshing={isRefreshingFareContracts}
        refresh={() => setNow(Date.now())}
        noItemsLabel={t(TicketingTexts.ticketHistoryTab.noItems)}
        now={now}
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
