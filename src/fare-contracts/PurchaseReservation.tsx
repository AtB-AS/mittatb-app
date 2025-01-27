import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {Reservation, PaymentType, useTicketingContext} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React from 'react';
import {ActivityIndicator, Linking, View} from 'react-native';
import {ValidityLine} from './ValidityLine';
import {FareContractStatusSymbol} from './components/FareContractStatusSymbol';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {getReservationStatus} from '@atb/fare-contracts/utils';

type Props = {
  reservation: Reservation;
};

export const PurchaseReservation: React.FC<Props> = ({reservation}) => {
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {customerProfile} = useTicketingContext();
  const {t, language} = useTranslation();

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
      <View style={styles.container} testID="purchaseReservation">
        <View style={styles.validityContainer}>
          <View style={styles.validityHeader}>
            {status === 'reserving' ? (
              <ActivityIndicator
                color={theme.color.foreground.dynamic.primary}
              />
            ) : (
              <FareContractStatusSymbol status={status} />
            )}
            <ThemeText
              typography="body__secondary"
              style={styles.reservationStatus}
            >
              {t(TicketingTexts.reservation[status])}
            </ThemeText>
          </View>
        </View>
        <VerifyingValidityLine status={status} />
        <View style={styles.infoContainer} accessible={true}>
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
              />
            )}
        </View>
      </View>
    </PressableOpacity>
  );
};

const VerifyingValidityLine = ({status}: {status: any}) => {
  const styles = useStyles();
  return (
    <View style={styles.validityDashContainer}>
      <ValidityLine status={status} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  validityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  detail: {
    paddingVertical: theme.spacing.xSmall,
  },
  container: {
    backgroundColor: theme.color.background.neutral[0].background,
    borderRadius: theme.border.radius.regular,
  },
  extraText: {
    paddingVertical: theme.spacing.xSmall,
    color: theme.color.foreground.dynamic.disabled,
  },
  validityContainer: {
    flexDirection: 'row',
    padding: theme.spacing.small,
  },
  validityDashContainer: {
    marginHorizontal: theme.spacing.medium,
  },
  infoContainer: {
    padding: theme.spacing.medium,
  },
  reservationStatus: {
    flex: 1,
    textAlign: 'right',
    marginLeft: theme.spacing.small,
  },
}));
