import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {Reservation, PaymentType} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React from 'react';
import {ActivityIndicator, Linking, View} from 'react-native';
import {ValidityLine} from './ValidityLine';
import {FareContractStatusSymbol} from './components/FareContractStatusSymbol';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import {useAuthState} from '@atb/auth';
import {PressableOpacity} from '@atb/components/pressable-opacity';

type Props = {
  reservation: Reservation;
};

export const PurchaseReservation: React.FC<Props> = ({reservation}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {abtCustomerId} = useAuthState();
  const {t, language} = useTranslation();

  async function openVippsUrl(vippsUrl: string) {
    try {
      await Linking.openURL(vippsUrl);
    } catch (err: any) {
      Bugsnag.notify(err);
    }
  }
  const getStatus = () => {
    const paymentStatus = reservation.paymentStatus;
    switch (paymentStatus) {
      case 'CAPTURE':
        return 'approved';
      case 'REJECT':
        return 'rejected';
      default:
        return 'reserving';
    }
  };

  // Filter out reservations for subaccounts
  if (reservation.customerAccountId !== abtCustomerId) return null;

  const status = getStatus();

  const paymentType = PaymentType[reservation.paymentType];
  return (
    <PressableOpacity accessible={false} importantForAccessibility="no">
      <View style={styles.container} testID="purchaseReservation">
        <View style={styles.validityContainer}>
          <View style={styles.validityHeader}>
            {status === 'reserving' ? (
              <ActivityIndicator color={theme.text.colors.primary} />
            ) : (
              <FareContractStatusSymbol status={status} />
            )}
            <ThemeText type="body__secondary" style={styles.reservationStatus}>
              {t(TicketingTexts.reservation[status])}
            </ThemeText>
          </View>
        </View>
        <VerifyingValidityLine status={status} />
        <View style={styles.infoContainer} accessible={true}>
          {status == 'rejected' && (
            <ThemeText type="body__secondary" color="secondary">
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
            type="body__secondary"
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
    paddingVertical: theme.spacings.xSmall,
  },
  container: {
    backgroundColor: theme.static.background.background_0.background,
    borderRadius: theme.border.radius.regular,
    marginBottom: theme.spacings.medium,
  },
  extraText: {
    paddingVertical: theme.spacings.xSmall,
    color: theme.text.colors.disabled,
  },
  validityContainer: {
    flexDirection: 'row',
    padding: theme.spacings.small,
  },
  validityDashContainer: {
    marginHorizontal: theme.spacings.medium,
  },
  infoContainer: {
    padding: theme.spacings.medium,
  },
  reservationStatus: {
    flex: 1,
    textAlign: 'right',
    marginLeft: theme.spacings.small,
  },
}));
