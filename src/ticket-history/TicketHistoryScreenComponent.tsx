import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {StyleSheet} from '@atb/theme';
import {
  Reservation,
  useFareContracts,
  useTicketingContext,
} from '@atb/ticketing';
import {useTimeContext} from '@atb/time';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {RefreshControl} from 'react-native-gesture-handler';
import {
  TicketHistoryMode,
  TicketHistoryScreenParams,
} from '@atb/ticket-history';
import {TicketHistoryModeTexts} from '@atb/translations/screens/Ticketing';
import {useAuthContext} from '@atb/auth';
import {HoldingHands, TicketTilted} from '@atb/assets/svg/color/images';
import React from 'react';

export const TicketHistoryScreenComponent = ({
  mode,
}: TicketHistoryScreenParams) => {
  const {
    sentFareContracts,
    isRefreshingFareContracts,
    reservations,
    rejectedReservations,
  } = useTicketingContext();
  const {serverNow} = useTimeContext();
  const {
    fareContracts: historicalFareContracts,
    refetch: refetchHistoricalFareContracts,
  } = useFareContracts({availability: 'historical'}, serverNow);

  const {abtCustomerId: customerAccountId} = useAuthContext();

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
          onRefresh={refetchHistoricalFareContracts}
        />
      }
    >
      <View style={styles.container}>
        <FareContractAndReservationsList
          fareContracts={
            mode === 'sent' ? sentFareContracts : historicalFareContracts
          }
          reservations={displayReservations(
            mode,
            reservations,
            rejectedReservations,
            customerAccountId,
          )}
          now={serverNow}
          emptyStateConfig={{
            title: t(TicketingTexts.ticketHistory.emptyState),
            details: t(TicketHistoryModeTexts[mode].emptyDetail),
            illustrationComponent: emptyStateImage(mode),
          }}
        />
      </View>
    </FullScreenView>
  );
};

const displayReservations = (
  mode: TicketHistoryMode,
  reservations: Reservation[],
  rejectedReservations: Reservation[],
  customerAccountId?: string,
) => {
  switch (mode) {
    case 'historical':
      return rejectedReservations.filter(
        (reservation) => reservation.customerAccountId === customerAccountId,
      );
    case 'sent':
      return reservations.filter(
        (reservation) => reservation.customerAccountId !== customerAccountId,
      );
  }
};

const emptyStateImage = (emptyStateMode: TicketHistoryMode) => {
  switch (emptyStateMode) {
    case 'historical':
      return <TicketTilted height={84} />;
    case 'sent':
      return <HoldingHands height={84} />;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.color.background.neutral[1].background,
    padding: theme.spacing.medium,
  },
}));
