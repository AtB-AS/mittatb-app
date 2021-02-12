import React from 'react';
import {View, TouchableOpacity, Linking, ActivityIndicator} from 'react-native';
import {StyleSheet, useTheme} from '../../../theme';
import {BlankTicket} from '../../../assets/svg/icons/ticketing';
import ThemeText from '../../../components/text';
import {ActiveReservation} from '../../../tickets';
import ThemeIcon from '../../../components/theme-icon';
import Button from '../../../components/button';
import {TicketsTexts, useTranslation} from '../../../translations';
import ValidityLine from '../Ticket/ValidityLine';

type Props = {
  reservation: ActiveReservation;
};

const TicketReservation: React.FC<Props> = ({reservation}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

  function openVippsUrl(vippsUrl: string) {
    if (Linking.canOpenURL(vippsUrl)) {
      Linking.openURL(vippsUrl);
    }
  }

  return (
    <TouchableOpacity>
      <View style={styles.ticketContainer}>
        <View style={styles.validityContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.iconContainer}>
              <ThemeIcon svg={BlankTicket} />
            </View>
            <ThemeText type="lead" color="faded">
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
            {t(
              TicketsTexts.reservation.orderId(
                reservation.reservation.order_id,
              ),
            )}
          </ThemeText>
          <ThemeText style={styles.orderText}>
            Betales med{' '}
            {reservation.paymentType === 'vipps'
              ? t(TicketsTexts.reservation.paymentType.vipps)
              : t(TicketsTexts.reservation.paymentType.creditcard)}
          </ThemeText>
          {reservation.paymentType === 'vipps' &&
            reservation.paymentStatus !== 'CAPTURE' && (
              <Button
                onPress={() => openVippsUrl(reservation.reservation.url)}
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
    backgroundColor: theme.background.level0,
    borderRadius: theme.border.radius.regular,
    marginBottom: theme.spacings.medium,
  },
  extraText: {
    paddingVertical: theme.spacings.xSmall,
    color: theme.text.colors.faded,
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
