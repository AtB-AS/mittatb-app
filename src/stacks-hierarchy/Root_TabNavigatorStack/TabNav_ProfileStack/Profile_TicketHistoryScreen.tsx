import React from 'react';
import {useTranslation, TicketingTexts} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {filterExpiredFareContracts, useTicketingState} from '@atb/ticketing';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import TicketHistoryTexts from '@atb/translations/screens/subscreens/TicketHistory';
import {useTimeContextState} from '@atb/time';
import {FullScreenView} from '@atb/components/screen-view';
import {PageHeading} from '@atb/components/heading';

export const Profile_TicketHistoryScreen: React.FC = () => {
  const {
    fareContracts,
    isRefreshingFareContracts,
    rejectedReservations,
    resubscribeFirestoreListeners,
  } = useTicketingState();

  const {serverNow} = useTimeContextState();
  const expiredFareContracts = filterExpiredFareContracts(
    fareContracts,
    serverNow,
  );

  const {t} = useTranslation();
  return (
    <FullScreenView
      headerProps={{
        title: t(TicketHistoryTexts.header),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={() => (
        <PageHeading text={t(TicketHistoryTexts.header)} />
      )}
    >
      <FareContractAndReservationsList
        fareContracts={expiredFareContracts}
        reservations={rejectedReservations}
        isRefreshing={isRefreshingFareContracts}
        refresh={resubscribeFirestoreListeners}
        now={serverNow}
        emptyStateTitleText={t(
          TicketingTexts.activeFareProductsAndReservationsTab
            .emptyTicketHistoryTitle,
        )}
        emptyStateDetailsText={t(
          TicketingTexts.activeFareProductsAndReservationsTab
            .emptyTicketHistoryDetails,
        )}
      />
    </FullScreenView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({}));
