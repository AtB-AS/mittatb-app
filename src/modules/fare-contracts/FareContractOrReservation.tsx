import {PurchaseReservation} from './PurchaseReservation';
import React from 'react';
import {Reservation} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {ErrorBoundary} from '@atb/screen-components/error-boundary';
import {FareContractView} from './FareContractView';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import type {MapFilterType} from '@atb/modules/map';

export function FareContractOrReservation({
  fcOrReservation,
  onPressFareContract,
  onNavigateToBonusScreen,
  onNavigateToPurchaseFlow,
  onNavigateToMap,
  now,
  index,
  isStatic,
}: {
  fcOrReservation: FareContractType | Reservation;
  onPressFareContract: () => void;
  onNavigateToBonusScreen: () => void;
  onNavigateToPurchaseFlow?: (newSelection: PurchaseSelectionType) => void;
  onNavigateToMap?: (initialFilters: MapFilterType) => void;
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
        now={now}
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
          onNavigateToBonusScreen={onNavigateToBonusScreen}
          onNavigateToPurchaseFlow={onNavigateToPurchaseFlow}
          onNavigateToMap={onNavigateToMap}
          testID={'ticket' + index}
        />
      </ErrorBoundary>
    );
  }
}
