import {StyleSheet} from '@atb/theme';
import {
  filterAndSortActiveOrCanBeUsedFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import React from 'react';
import {View} from 'react-native';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {useTranslation, TicketingTexts} from '@atb/translations';
import {useAnalytics} from '@atb/analytics';
import {useTimeContextState} from '@atb/time';

export const TicketTabNav_ActiveFareProductsTabScreen = () => {
  const {
    reservations,
    fareContracts,
    isRefreshingFareContracts,
    resubscribeFirestoreListeners,
  } = useTicketingState();
  const {now} = useTimeContextState();
  const analytics = useAnalytics();

  const activeFareContracts = filterAndSortActiveOrCanBeUsedFareContracts(
    fareContracts,
    now,
  );

  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <FareContractAndReservationsList
        reservations={reservations}
        fareContracts={activeFareContracts}
        isRefreshing={isRefreshingFareContracts}
        refresh={() => {
          resubscribeFirestoreListeners();
          analytics.logEvent('Ticketing', 'Pull to refresh tickets', {
            reservationsCount: reservations.length,
            activeFareContractsCount: activeFareContracts.length,
          });
        }}
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
