import {ScreenHeading} from '@atb/components/heading';
import {FullScreenView} from '@atb/components/screen-view';
import {FareContractAndReservationsList} from '@atb/fare-contracts';
import {
  FareContract,
  filterExpiredFareContracts,
  useTicketingState,
} from '@atb/ticketing';
import {useTimeContextState} from '@atb/time';
import {
  TicketingTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {RefreshControl} from 'react-native-gesture-handler';

type Mode = 'expired' | 'sent';

type Props = {mode: Mode};

export const TicketHistoryScreenComponent = ({mode}: Props) => {
  const {
    fareContracts,
    isRefreshingFareContracts,
    rejectedReservations,
    resubscribeFirestoreListeners,
  } = useTicketingState();

  const {serverNow} = useTimeContextState();

  const {t} = useTranslation();

  return (
    <FullScreenView
      headerProps={{
        title: getTitle(mode, t),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading ref={focusRef} text={getTitle(mode, t)} />
      )}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshingFareContracts}
          onRefresh={resubscribeFirestoreListeners}
        />
      }
    >
      <FareContractAndReservationsList
        fareContracts={displayFareContracts(mode, fareContracts, serverNow)}
        reservations={rejectedReservations}
        now={serverNow}
        emptyStateMode={mode}
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

const getTitle = (mode: Mode, t: TranslateFunction) => {
  switch (mode) {
    case 'expired':
      return t(TicketingTexts.expiredTickets.title);
    case 'sent':
      return t(TicketingTexts.sentToOthers.title);
  }
};

const displayFareContracts = (
  mode: Mode,
  fareContracts: FareContract[],
  serverNow: number,
) => {
  switch (mode) {
    case 'expired':
      return filterExpiredFareContracts(fareContracts, serverNow);
    case 'sent': // TODO replace with sent fare contracts
      return filterExpiredFareContracts(fareContracts, serverNow);
  }
};
