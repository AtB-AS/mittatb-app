import {PurchaseReservation} from '@atb/fare-contracts/PurchaseReservation';
import React from 'react';
import {FareContract, Reservation} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import {SimpleFareContract} from '@atb/fare-contracts';
import {ErrorBoundary} from '@atb/error-boundary';
import {TicketHistoryMode} from '@atb/ticket-history';
import {StyleSheet} from '@atb/theme';

export function FareContractOrReservation({
  fcOrReservation,
  onPressFareContract,
  now,
  mode,
  index,
}: {
  fcOrReservation: FareContract | Reservation;
  onPressFareContract: () => void;
  now: number;
  mode?: TicketHistoryMode;
  index: number;
}) {
  const {t} = useTranslation();
  const hasActiveTravelCard = false;
  const styles = useStyles();

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
          sentToOthers={mode === 'sent'}
          onPressDetails={onPressFareContract}
          testID={'ticket' + index}
          style={styles.fareContract}
        />
      </ErrorBoundary>
    );
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  fareContract: {
    paddingBottom: theme.spacings.large,
  },
}));
