import React from 'react';
import {useTranslation, TicketingTexts} from '@atb/translations';
import {filterExpiredFareContracts, useTicketingState} from '@atb/ticketing';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import TicketHistoryTexts from '@atb/translations/screens/subscreens/TicketHistory';
import {useTimeContextState} from '@atb/time';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {RefreshControl} from 'react-native-gesture-handler';

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
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={t(TicketHistoryTexts.header)} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshingFareContracts}
          onRefresh={resubscribeFirestoreListeners}
        />
      }
    >
      <FareContractAndReservationsList
        fareContracts={expiredFareContracts}
        reservations={rejectedReservations}
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
