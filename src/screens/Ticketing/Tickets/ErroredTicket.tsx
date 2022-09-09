import MessageBox from '@atb/components/message-box';
import {TicketsTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {Reservation} from '@atb/tickets';
import {getPaymentMode} from '@atb/screens/Ticketing/Tickets/utils';

const ErroredTicket = ({reservation}: {reservation: Reservation}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [shouldShowError, setShouldShowError] = useState(false);
  useEffect(() => {
    setShouldShowError(reservation.paymentStatus === 'REJECT');
  }, [reservation.paymentStatus]);

  if (shouldShowError) {
    return (
      <MessageBox
        containerStyle={styles.messageBox}
        type="error"
        message={t(
          TicketsTexts.reservation.paymentError(
            reservation.orderId,
            getPaymentMode(reservation.paymentType, t),
            reservation.created.toDate().toLocaleString(),
          ),
        )}
        isDismissable={true}
        onDismiss={() => setShouldShowError(false)}
      />
    );
  } else {
    return <></>;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  messageBox: {
    marginBottom: theme.spacings.large,
  },
}));

export default ErroredTicket;
