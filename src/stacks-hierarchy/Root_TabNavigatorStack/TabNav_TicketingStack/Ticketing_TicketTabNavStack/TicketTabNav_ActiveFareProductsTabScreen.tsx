import {StyleSheet} from '@atb/theme';
import {
  filterAndSortActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';

import {useInterval} from '@atb/utils/use-interval';
import React, {useState} from 'react';
import {View} from 'react-native';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {useTranslation, TicketingTexts} from '@atb/translations';

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
          TicketingTexts.activeFareProductsAndReservationsTab
            .noActiveTicketsTitle,
        )}
        emptyStateDetailsText={t(
          TicketingTexts.activeFareProductsAndReservationsTab
            .noActiveTicketsDetails,
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
