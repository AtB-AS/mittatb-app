import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  Reservation,
  PaymentType,
  useTicketingContext,
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
import {NativeTouchable} from '@atb/components/native-touchable';
import {WithValidityLine} from './components/WithValidityLine';
import {getReservationStatus} from './utils';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  useCancelReservationMutation,
  useIsReservationCancelled,
} from './use-cancel-reservation-mutation';

type Props = {
  reservation: Reservation;
  now: number;
};

export const PurchaseReservation: React.FC<Props> = ({reservation, now}) => {
  const styles = useStyles();
  const {customerProfile} = useTicketingContext();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const cancelMutation = useCancelReservationMutation(reservation);
  const isCancelled = useIsReservationCancelled(reservation.orderId);

  const isSubAccountReservation = customerProfile?.subAccounts?.some(
    (id) => id === reservation.customerAccountId,
  );

  // filter out reservations for subaccount
  if (isSubAccountReservation) {
    return null;
  }

  if (isCancelled) {
    return null;
  }

  const status = getReservationStatus(reservation);

  const paymentType = PaymentType[reservation.paymentType];
  return (
    <NativeTouchable
      variant="block"
      accessible={false}
      importantForAccessibility="no"
    >
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
        <GenericSectionItem accessibility={{accessible: true}}>
          {status == 'rejected' && (
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
          <ThemeText
            typography="body__s"
            type="secondary"
            style={styles.detail}
          >
            {t(TicketingTexts.reservation.paymentMethod(paymentType))}
          </ThemeText>
          <ThemeText style={styles.detail}>
            {t(TicketingTexts.reservation.orderId(reservation.orderId))}
          </ThemeText>
          {status === 'reserving' && (
            <View style={styles.actions}>
              {reservation.paymentType === PaymentType.Vipps && (
                <Button
                  expanded={true}
                  onPress={async () => await openUrl(reservation.url)}
                  accessibilityRole="link"
                  text={t(TicketingTexts.reservation.goToVipps)}
                  mode="tertiary"
                  backgroundColor={theme.color.background.neutral[0]}
                />
              )}
              <Button
                expanded={true}
                onPress={() => cancelMutation.mutate()}
                text={t(PurchaseConfirmationTexts.cancelPayment)}
                mode="tertiary"
                backgroundColor={theme.color.background.neutral[0]}
                loading={cancelMutation.isPending}
              />
            </View>
          )}
          {cancelMutation.isError && (
            <MessageInfoBox
              type="error"
              message={t(PurchaseConfirmationTexts.cancelPaymentError)}
            />
          )}
        </GenericSectionItem>
      </Section>
    </NativeTouchable>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  genericSectionItemOverrides: {
    paddingVertical: 0,
    borderWidth: 0,
  },
  detail: {
    paddingVertical: theme.spacing.xSmall,
  },
  actions: {
    flex: 1,
    rowGap: theme.spacing.small,
  },
}));
