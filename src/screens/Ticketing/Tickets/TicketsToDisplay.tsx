import TicketReservation from '@atb/screens/Ticketing/Tickets/TicketReservation';
import React from 'react';
import {FareContract, Reservation} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import SimpleTicket from '@atb/screens/Ticketing/Ticket';
import ErrorBoundary from '@atb/error-boundary';

export default function TicketsToDisplay({
  type,
  ticket,
  navigation,
  now,
  index,
}: {
  type: 'fareContract' | 'reservation';
  ticket: FareContract | Reservation;
  navigation: any;
  now: number;
  index: number;
}) {
  const {t} = useTranslation();
  const hasActiveTravelCard = false;

  if (type === 'reservation') {
    return (
      <TicketReservation
        key={ticket.orderId}
        reservation={ticket as Reservation}
      />
    );
  } else {
    return (
      <ErrorBoundary
        key={ticket.orderId}
        message={t(TicketsTexts.scrollView.errorLoadingTicket(ticket.orderId))}
      >
        <SimpleTicket
          hasActiveTravelCard={hasActiveTravelCard}
          fareContract={ticket as FareContract}
          now={now}
          onPressDetails={() =>
            navigation.navigate('TicketModal', {
              screen: 'TicketDetails',
              params: {orderId: ticket.orderId},
            })
          }
          testID={'ticket' + index}
        />
      </ErrorBoundary>
    );
  }
}
