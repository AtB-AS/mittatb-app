import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  Reservation,
  PaymentType,
  useTicketingContext,
  useCancelPaymentMutation,
} from '@atb/modules/ticketing';
import {
  PurchaseConfirmationTexts,
  TicketingTexts,
  useTranslation,
} from '@atb/translations';
import {openUrl} from '@atb/utils/open-url';
import React from 'react';
import {View} from 'react-native';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import {WithValidityLine} from './components/WithValidityLine';
import {getReservationStatus} from './utils';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {MessageInfoBox} from '@atb/components/message-info-box';

type Props = {
  reservation: Reservation;
  now: number;
};

export const PurchaseReservation: React.FC<Props> = ({reservation, now}) => {
  const styles = useStyles();
  const {customerProfile} = useTicketingContext();
  const {t, language} = useTranslation();
  const cancelMutation = useCancelPaymentMutation();

  const isSubAccountReservation = customerProfile?.subAccounts?.some(
    (id) => id === reservation.customerAccountId,
  );

  // filter out reservations for subaccount
  if (isSubAccountReservation) {
    return null;
  }

  const status = getReservationStatus(reservation);

  const paymentType = PaymentType[reservation.paymentType];
  return (
    <Section>
      <GenericSectionItem style={styles.genericSectionItemOverrides}>
        <WithValidityLine
          reservation={reservation}
          enabledLine={status !== 'rejected'}
          now={now}
        >
          <ThemeText typography="heading__l">
            {t(TicketingTexts.reservation[status])}
          </ThemeText>
        </WithValidityLine>
      </GenericSectionItem>
      <GenericSectionItem>
        <View style={styles.detail}>
          {status === 'rejected' && (
            <ThemeText typography="body__s" type="secondary">
              {t(
                TicketingTexts.reservation.orderDate(
                  formatToLongDateTime(
                    fromUnixTime(reservation.created.getTime() / 1000),
                    language,
                  ),
                ),
              )}
            </ThemeText>
          )}
          <View style={styles.detailTexts}>
            <ThemeText typography="body__s" type="secondary">
              {t(TicketingTexts.reservation.paymentMethod(paymentType))}
            </ThemeText>
            <ThemeText>
              {t(TicketingTexts.reservation.orderId(reservation.orderId))}
            </ThemeText>
          </View>
          {status === 'reserving' &&
            reservation.paymentType === PaymentType.Vipps && (
              <Button
                surfaceColor="accent"
                expanded={true}
                onPress={async () => await openUrl(reservation.url)}
                accessibilityRole="link"
                text={t(TicketingTexts.reservation.goToVipps)}
                mode="secondary"
              />
            )}
          {status === 'reserving' &&
            !!reservation.paymentId &&
            !cancelMutation.isSuccess && (
              <Button
                expanded={true}
                onPress={() =>
                  cancelMutation.mutate({payment: reservation, isUser: true})
                }
                text={t(PurchaseConfirmationTexts.cancelPayment)}
                mode="primary"
                surfaceColor="error"
                loading={cancelMutation.isPending}
              />
            )}
          {cancelMutation.isError && (
            <MessageInfoBox
              type="error"
              message={t(PurchaseConfirmationTexts.cancelPaymentError)}
            />
          )}
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  genericSectionItemOverrides: {
    paddingVertical: 0,
    borderWidth: 0,
  },
  detail: {
    flex: 1,
    gap: theme.spacing.medium,
  },
  detailTexts: {
    flex: 1,
    gap: theme.spacing.small,
  },
}));
