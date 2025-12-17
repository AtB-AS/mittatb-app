import {PurchaseReservation} from './PurchaseReservation';
import React from 'react';
import {Reservation} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {ErrorBoundary} from '@atb/screen-components/error-boundary';
import {FareContractView} from './FareContractView';

export function FareContractOrReservation({
  fcOrReservation,
  onPressFareContract,
  navigateToBonusScreen,
  now,
  index,
  isStatic,
}: {
  fcOrReservation: FareContractType | Reservation;
  onPressFareContract: () => void;
  navigateToBonusScreen: () => void;
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
          navigateToBonusScreen={navigateToBonusScreen}
          testID={'ticket' + index}
        />
      </ErrorBoundary>
    );
  }
}
