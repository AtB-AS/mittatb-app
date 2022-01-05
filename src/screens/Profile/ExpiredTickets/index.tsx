import React, {useState} from 'react';
import {View} from 'react-native';
import {TicketsTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {filterExpiredFareContracts, useTicketState} from '@atb/tickets';
import TicketsScrollView from '@atb/screens/Ticketing/Tickets/TicketsScrollView';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import ExpiredTicketsTexts from '@atb/translations/screens/subscreens/ExpiredTickets';

export const ExpiredTickets: React.FC = () => {
  const {fareContracts, isRefreshingTickets} = useTicketState();

  const [now, setNow] = useState<number>(Date.now());
  const expiredFareContracts = filterExpiredFareContracts(fareContracts);

  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(ExpiredTicketsTexts.header)}
        leftButton={{type: 'back'}}
      />
      <TicketsScrollView
        fareContracts={expiredFareContracts}
        isRefreshingTickets={isRefreshingTickets}
        refreshTickets={() => setNow(Date.now())}
        noTicketsLabel={t(TicketsTexts.expiredTicketsTab.noTickets)}
        now={now}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_1.backgroundColor,
  },
}));
