import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import {Reservation, PaymentType} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React from 'react';
import {ActivityIndicator, Linking, TouchableOpacity, View} from 'react-native';
import ValidityLine from '../Ticket/ValidityLine';
import TicketStatusSymbol from '@atb/screens/Ticketing/Ticket/Component/TicketStatusSymbol';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';

type Props = {
  reservation: Reservation;
};

const TicketReservation: React.FC<Props> = ({reservation}) => {
  const styles = useStyles();
  const {theme} = useTheme();
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

  const status = getStatus();

  const paymentType = PaymentType[reservation.paymentType];
  return (
    <TouchableOpacity accessible={false} importantForAccessibility="no">
      <View style={styles.ticketContainer} testID="ticketReservation">
        <View style={styles.validityContainer}>
          <View style={styles.validityHeader}>
            {status === 'reserving' ? (
              <ActivityIndicator color={theme.text.colors.primary} />
            ) : (
              <TicketStatusSymbol status={status}></TicketStatusSymbol>
            )}
            <ThemeText type="body__secondary" style={styles.reservationStatus}>
              {t(TicketsTexts.reservation[status])}
            </ThemeText>
          </View>
        </View>
        <VerifyingValidityLine status={status} />
        <View style={styles.ticketInfoContainer}>
          <ThemeText style={styles.detail}>
            {t(TicketsTexts.reservation.orderId(reservation.orderId))}
          </ThemeText>
          <ThemeText style={styles.detail}>
            {t(TicketsTexts.reservation.paymentMethod(paymentType))}
          </ThemeText>
          {status == 'rejected' && (
            <ThemeText style={styles.detail}>
              {t(
                TicketsTexts.reservation.orderDate(
                  formatToLongDateTime(
                    fromUnixTime(reservation.created.toMillis() / 1000),
                    language,
                  ),
                ),
              )}
            </ThemeText>
          )}
          {reservation.paymentType === PaymentType.Vipps &&
            status === 'reserving' && (
              <Button
                onPress={() => openVippsUrl(reservation.url)}
                text={t(TicketsTexts.reservation.goToVipps)}
                mode="tertiary"
              />
            )}
        </View>
      </View>
    </TouchableOpacity>
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
  ticketContainer: {
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
  ticketInfoContainer: {
    padding: theme.spacings.medium,
  },
  reservationStatus: {
    flex: 1,
    textAlign: 'right',
    marginLeft: theme.spacings.small,
  },
}));

export default TicketReservation;
