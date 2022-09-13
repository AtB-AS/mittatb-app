import {StyleSheet} from '@atb/theme';
import {
  filterAndSortActiveOrCanBeUsedFareContracts,
  useTicketState,
} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import useInterval from '@atb/utils/use-interval';
import React, {useState} from 'react';
import {View} from 'react-native';
import TicketsScrollView from '../TicketsScrollView';

export const ActiveTickets = () => {
  const {reservations, fareContracts, isRefreshingTickets, refreshTickets} =
    useTicketState();
  const activeFareContracts =
    filterAndSortActiveOrCanBeUsedFareContracts(fareContracts);

  const hasAnyFareContractsOnAccount = fareContracts.length > 0;

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);

  const styles = useStyles();
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <TicketsScrollView
        reservations={reservations}
        fareContracts={activeFareContracts}
        isRefreshingTickets={isRefreshingTickets}
        refreshTickets={refreshTickets}
        noTicketsLabel={t(
          hasAnyFareContractsOnAccount
            ? TicketsTexts.activeTicketsTab.noTicketsExpiredHelpText
            : TicketsTexts.activeTicketsTab.noTickets,
        )}
        now={now}
        showTokenInfo={true}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background.background_1.background,
  },
  buyPeriodTicketButton: {
    marginTop: theme.spacings.medium,
  },
}));
