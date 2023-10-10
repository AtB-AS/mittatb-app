import {StyleSheet} from '@atb/theme';
import {
  filterAndSortActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';

import {useInterval} from '@atb/utils/use-interval';
import React, {useState} from 'react';
import {View} from 'react-native';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {useTranslation, TicketingTexts, dictionary} from '@atb/translations';

export const TicketTabNav_ActiveFareProductsTabScreen = () => {
  const {
    reservations,
    fareContracts,
    isRefreshingFareContracts,
    resubscribeFirestoreListeners,
  } = useTicketingState();
  const activeFareContracts =
    filterAndSortActiveOrCanBeUsedFareContracts(fareContracts);

  const [now, setNow] = useState<number>(Date.now());
  useInterval(() => setNow(Date.now()), 2500);

  const styles = useStyles();
  const {t} = useTranslation();

  const noActiveTicketsDetailsText = t(
    TicketingTexts.activeFareProductsAndReservationsTab.noActiveTickets.details,
  );

  return (
    <View style={styles.container}>
      <FareContractAndReservationsList
        reservations={reservations}
        fareContracts={activeFareContracts}
        isRefreshing={isRefreshingFareContracts}
        refresh={resubscribeFirestoreListeners}
        now={now}
        showTokenInfo={true}
        emptyStateTitleText={t(
          TicketingTexts.activeFareProductsAndReservationsTab.noActiveTickets
            .title,
        )}
        emptyStateDetailsText={`${noActiveTicketsDetailsText} ${t(
          TicketingTexts.activeFareProductsAndReservationsTab.noActiveTickets
            .pullToRefresh,
        )}`}
        emptyStateDetailsA11yLabel={`${noActiveTicketsDetailsText} ${t(
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
