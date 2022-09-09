import {Ticket} from '@atb/assets/svg/mono-icons/ticketing';
import Button from '@atb/components/button';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {StyleSheet, useTheme} from '@atb/theme';
import {Reservation, PaymentType} from '@atb/tickets';
import {TicketsTexts, useTranslation} from '@atb/translations';
import Bugsnag from '@bugsnag/react-native';
import React from 'react';
import {ActivityIndicator, Linking, TouchableOpacity, View} from 'react-native';
import ValidityLine from '../Ticket/ValidityLine';
import {getPaymentMode} from '@atb/screens/Ticketing/Tickets/utils';

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

  const paymentType = getPaymentMode(reservation.paymentType, t);

  return (
    <TouchableOpacity>
      <View style={styles.ticketContainer} testID="ticketReservation">
        <View style={styles.validityContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.iconContainer}>
              <ThemeIcon svg={Ticket} />
            </View>
            <ThemeText type="body__secondary" color="secondary">
              {reservation.paymentStatus !== 'CAPTURE'
                ? t(TicketsTexts.reservation.processing)
                : t(TicketsTexts.reservation.approved)}
            </ThemeText>
          </View>
          <ActivityIndicator color={theme.text.colors.primary} />
        </View>
        <VerifyingValidityLine />
        <View style={styles.ticketInfoContainer}>
          <ThemeText style={styles.orderText}>
            {t(TicketsTexts.reservation.orderId(reservation.orderId))}
          </ThemeText>
          <ThemeText style={styles.orderText}>
            {reservation.paymentStatus !== 'CAPTURE'
              ? t(TicketsTexts.reservation.paymentStage.processing(paymentType))
              : t(TicketsTexts.reservation.paymentStage.approved(paymentType))}
          </ThemeText>
          {reservation.paymentType === PaymentType.Vipps &&
            reservation.paymentStatus !== 'CAPTURE' && (
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

const VerifyingValidityLine: React.FC = () => {
  const styles = useStyles();

  return (
    <View style={styles.validityDashContainer}>
      <ValidityLine status="reserving" />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  iconContainer: {marginRight: theme.spacings.medium},
  orderText: {
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
