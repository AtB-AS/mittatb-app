import React from 'react';
import {View, TouchableOpacity, Linking, ActivityIndicator} from 'react-native';
import {StyleSheet, useTheme} from '../../../theme';
import {BlankTicket} from '../../../assets/svg/icons/ticketing';
import Dash from 'react-native-dash';
import ThemeText from '../../../components/text';
import {ActiveReservation} from '../../../TicketContext';
import ThemeIcon from '../../../components/theme-icon';
import Button from '../../../components/button';

type Props = {
  reservation: ActiveReservation;
};

const TicketReservation: React.FC<Props> = ({reservation}) => {
  const styles = useStyles();
  const {theme} = useTheme();

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
                ? 'Prosesseres... ikke gyldig enda'
                : 'Betaling godkjent. Henter billett...'}
            </ThemeText>
          </View>
          <ActivityIndicator color={theme.text.colors.primary} />
        </View>
        <VerifyingValidityLine />
        <View style={styles.ticketInfoContainer}>
          <ThemeText style={styles.orderText}>
            Ordre-id {reservation.reservation.order_id}
          </ThemeText>
          <ThemeText style={styles.orderText}>
            Betales med{' '}
            {reservation.paymentType === 'vipps' ? 'Vipps' : 'kredittkort'}
          </ThemeText>
          {reservation.paymentType === 'vipps' &&
            reservation.paymentStatus !== 'CAPTURE' && (
              <Button
                onPress={() => openVippsUrl(reservation.reservation.url)}
                text="Gå til Vipps for betaling"
                mode="tertiary"
              />
            )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const VerifyingValidityLine: React.FC<{}> = () => {
  const styles = useStyles();
  const {theme} = useTheme();

  return (
    <View style={styles.validityDashContainer}>
      <Dash
        style={{width: '100%'}}
        dashGap={0}
        dashLength={1}
        dashThickness={4}
        dashColor={theme.background.level1}
      />
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
    flexDirection: 'row',
  },
  ticketInfoContainer: {
    padding: theme.spacings.medium,
  },
}));

export default TicketReservation;
