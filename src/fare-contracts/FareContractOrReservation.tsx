import {PurchaseReservation} from '@atb/fare-contracts/PurchaseReservation';
import React from 'react';
import {FareContract, Reservation} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {ErrorBoundary} from '@atb/error-boundary';
import {FareContractView} from './FareContractView';

export function FareContractOrReservation({
  fcOrReservation,
  onPressFareContract,
  now,
  index,
  isStatic,
}: {
  fcOrReservation: FareContract | Reservation;
  onPressFareContract: () => void;
  now: number;
  index: number;
  isStatic?: boolean;
}) {
  const {t} = useTranslation();

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
        <FareContractView
          now={now}
          fareContract={fcOrReservation}
          isStatic={isStatic}
          onPressDetails={onPressFareContract}
          testID={'ticket' + index}
        />
      </ErrorBoundary>
    );
  }
}
