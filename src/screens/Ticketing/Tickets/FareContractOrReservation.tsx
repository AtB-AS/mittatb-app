import TicketReservation from '@atb/screens/Ticketing/Tickets/TicketReservation';
import React from 'react';
import {FareContract, Reservation} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import SimpleTicket from '@atb/screens/Ticketing/Ticket';
import ErrorBoundary from '@atb/error-boundary';

export default function FareContractOrReservation({
  fcOrReservation,
  onPressFareContract,
  now,
  index,
}: {
  fcOrReservation: FareContract | Reservation;
  onPressFareContract: () => void;
  now: number;
  index: number;
}) {
  const {t} = useTranslation();
  const hasActiveTravelCard = false;

  if ('transactionId' in fcOrReservation) {
    return (
      <TicketReservation
        key={fcOrReservation.orderId}
        reservation={fcOrReservation}
      />
    );
  } else {
    return (
      <ErrorBoundary
        key={fcOrReservation.orderId}
        message={t(
          TicketsTexts.scrollView.errorLoadingTicket(fcOrReservation.orderId),
        )}
      >
        <SimpleTicket
          hasActiveTravelCard={hasActiveTravelCard}
          fareContract={fcOrReservation}
          now={now}
          onPressDetails={onPressFareContract}
          testID={'ticket' + index}
        />
      </ErrorBoundary>
    );
  }
}
