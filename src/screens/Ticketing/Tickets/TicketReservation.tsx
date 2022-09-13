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

type Props = {
  reservation: Reservation;
};

const TicketReservation: React.FC<Props> = ({reservation}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

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

  const paymentType =
    reservation.paymentType === PaymentType.Vipps
      ? t(TicketsTexts.reservation.paymentType.vipps)
      : t(TicketsTexts.reservation.paymentType.creditcard);

  return (
    <TouchableOpacity>
      <View style={styles.ticketContainer} testID="ticketReservation">
        <View style={styles.validityContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.iconContainer}>
              <TicketStatusSymbol status={status}></TicketStatusSymbol>
            </View>
            <ThemeText type="body__secondary" color="secondary">
              {t(TicketsTexts.reservation[status])}
            </ThemeText>
          </View>
          {status === 'reserving' && (
            <ActivityIndicator color={theme.text.colors.primary} />
          )}
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
                  reservation.created.toDate().toLocaleString(),
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
  iconContainer: {marginRight: theme.spacings.medium},
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 3,
    padding: theme.spacings.medium,
  },
  validityDashContainer: {
    marginHorizontal: theme.spacings.medium,
  },
  ticketInfoContainer: {
    padding: theme.spacings.medium,
  },
}));

export default TicketReservation;
