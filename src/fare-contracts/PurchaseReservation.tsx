import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Reservation, PaymentType, useTicketingContext} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React from 'react';
import {Linking} from 'react-native';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {WithValidityLine} from '@atb/fare-contracts/components/WithValidityLine';
import {getReservationStatus} from '@atb/fare-contracts/utils';
import {GenericSectionItem, Section} from '@atb/components/sections';

type Props = {
  reservation: Reservation;
};

export const PurchaseReservation: React.FC<Props> = ({reservation}) => {
  const styles = useStyles();
  const {customerProfile} = useTicketingContext();
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();

  async function openVippsUrl(vippsUrl: string) {
    try {
      await Linking.openURL(vippsUrl);
    } catch (err: any) {
      Bugsnag.notify(err);
    }
  }

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
    <PressableOpacity accessible={false} importantForAccessibility="no">
      <Section>
        <GenericSectionItem style={{paddingVertical: 0}}>
          <WithValidityLine
            reservation={reservation}
            enabledLine={status !== 'rejected'}
          >
            <ThemeText typography="heading--medium">
              {t(TicketingTexts.reservation[status])}
            </ThemeText>
          </WithValidityLine>
        </GenericSectionItem>
        <GenericSectionItem accessibility={{accessible: true}}>
          {status == 'rejected' && (
            <ThemeText typography="body__secondary" color="secondary">
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
            typography="body__secondary"
            color="secondary"
            style={styles.detail}
          >
            {t(TicketingTexts.reservation.paymentMethod(paymentType))}
          </ThemeText>
          <ThemeText style={styles.detail}>
            {t(TicketingTexts.reservation.orderId(reservation.orderId))}
          </ThemeText>
          {reservation.paymentType === PaymentType.Vipps &&
            status === 'reserving' && (
              <Button
                expanded={true}
                onPress={() => openVippsUrl(reservation.url)}
                accessibilityRole="link"
                text={t(TicketingTexts.reservation.goToVipps)}
                mode="tertiary"
                backgroundColor={theme.color.background.neutral[0]}
              />
            )}
        </GenericSectionItem>
      </Section>
    </PressableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  detail: {
    paddingVertical: theme.spacing.xSmall,
  },
}));
