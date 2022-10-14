import PurchaseReservation from '@atb/screens/Ticketing/FareContracts/PurchaseReservation';
import React from 'react';
import {FareContract, Reservation} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import SimpleFareContract from '@atb/screens/Ticketing/FareContracts/index';
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
      <PurchaseReservation
        key={fcOrReservation.orderId}
        reservation={fcOrReservation}
      />
    );
  } else {
    return (
      <ErrorBoundary
        key={fcOrReservation.orderId}
        message={t(
          TicketingTexts.scrollView.errorLoadingTicket(fcOrReservation.orderId),
        )}
      >
        <SimpleFareContract
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
