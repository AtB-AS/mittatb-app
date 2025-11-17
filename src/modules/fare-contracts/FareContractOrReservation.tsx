import {PurchaseReservation} from './PurchaseReservation';
import React from 'react';
import {Reservation} from '@atb/modules/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {ErrorBoundary} from '@atb/screen-components/error-boundary';
import {FareContractView} from './FareContractView';
import {FareContractInfo} from './use-fare-contract-info';

export function FareContractOrReservation({
  fcOrReservation,
  onPressFareContract,
  now,
  index,
  isStatic,
}: {
  fcOrReservation: FareContractInfo | Reservation;
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
