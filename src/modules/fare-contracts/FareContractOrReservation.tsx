import {PurchaseReservation} from './PurchaseReservation';
import React from 'react';
import {Reservation} from '@atb/modules/ticketing';
import {FareContractType} from '@atb-as/utils';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {ErrorBoundary} from '@atb/screen-components/error-boundary';
import {FareContractView} from './FareContractView';
import type {PurchaseSelectionType} from '@atb/modules/purchase-selection';
import {getValidityStatus} from './utils';

type Props = {
  fcOrReservation: FareContractType | Reservation;
  onPressFareContract: (id: string) => void;
  onNavigateToBonusScreen: () => void;
  onNavigateToPurchaseFlow?: (newSelection: PurchaseSelectionType) => void;
  now: number;
  index: number;
  isStatic?: boolean;
  isFocused?: boolean;
};

function arePropsEqual(prevProps: Props, nextProps: Props): boolean {
  // Check all props except `now` for shallow equality
  if (prevProps.fcOrReservation !== nextProps.fcOrReservation) return false;
  if (prevProps.onPressFareContract !== nextProps.onPressFareContract)
    return false;
  if (prevProps.onNavigateToBonusScreen !== nextProps.onNavigateToBonusScreen)
    return false;
  if (prevProps.onNavigateToPurchaseFlow !== nextProps.onNavigateToPurchaseFlow)
    return false;
  if (prevProps.index !== nextProps.index) return false;
  if (prevProps.isStatic !== nextProps.isStatic) return false;
  if (prevProps.isFocused !== nextProps.isFocused) return false;

  // If `now` hasn't changed, everything is equal
  if (prevProps.now === nextProps.now) return true;

  // `now` changed. Decide if it matters for this item.
  const item = nextProps.fcOrReservation;

  // Reservations don't use `now` for display — their status depends on
  // paymentStatus, not time.
  if ('transactionId' in item) return true;

  // For fare contracts: only re-render if the validity status actually
  // changed (a boundary was crossed, e.g. upcoming → valid). The countdown
  // text in ValidityTime updates itself via its own per-second timer, so the
  // parent tree does not need to re-render for that.
  const prevStatus = getValidityStatus(prevProps.now, item);
  const nextStatus = getValidityStatus(nextProps.now, item);

  return prevStatus === nextStatus;
}

export const FareContractOrReservation = React.memo(
  function FareContractOrReservation({
    fcOrReservation,
    onPressFareContract,
    onNavigateToBonusScreen,
    onNavigateToPurchaseFlow,
    now,
    index,
    isStatic,
    isFocused,
  }: Props) {
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
            TicketingTexts.scrollView.errorLoadingTicket(
              fcOrReservation.orderId,
            ),
          )}
        >
          <FareContractView
            now={now}
            fareContract={fcOrReservation}
            isStatic={isStatic}
            isFocused={isFocused}
            onPressDetails={() => onPressFareContract(fcOrReservation.id)}
            onNavigateToBonusScreen={onNavigateToBonusScreen}
            onNavigateToPurchaseFlow={onNavigateToPurchaseFlow}
            testID={'ticket' + index}
          />
        </ErrorBoundary>
      );
    }
  },
  arePropsEqual,
);
