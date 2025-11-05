import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  Reservation,
  PaymentType,
  useTicketingContext,
} from '@atb/modules/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React from 'react';
import {Linking, View} from 'react-native';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {WithValidityLine} from './components/WithValidityLine';
import {getReservationStatus} from './utils';
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
        <GenericSectionItem style={styles.genericSectionItemOverrides}>
          <WithValidityLine
            reservation={reservation}
            enabledLine={status !== 'rejected'}
          >
            <ThemeText typography="heading__l" style={styles.statusText}>
              {t(TicketingTexts.reservation[status])}
            </ThemeText>
          </WithValidityLine>
        </GenericSectionItem>
        <GenericSectionItem accessibility={{accessible: true}}>
          {status == 'rejected' && (
            <ThemeText typography="body__s" color="secondary">
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
              <View style={styles.vippsLinkContainer}>
                <Button
                  expanded={true}
                  onPress={() => openVippsUrl(reservation.url)}
                  accessibilityRole="link"
                  text={t(TicketingTexts.reservation.goToVipps)}
                  mode="tertiary"
                  backgroundColor={theme.color.background.neutral[0]}
                />
              </View>
            )}
        </GenericSectionItem>
      </Section>
    </PressableOpacity>
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
  statusText: {
    textAlign: 'center',
  },
  vippsLinkContainer: {
    flex: 1,
  },
}));
