import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {formatToLongDateTime, secondsToDuration} from '../../../utils/date';
import {FareContract} from '../../../api/fareContracts';
import {StyleSheet, useTheme} from '../../../theme';
import {
  BlankTicket,
  InvalidTicket,
  ValidTicket,
} from '../../../assets/svg/icons/ticketing';
import colors from '../../../theme/colors';
import Dash from 'react-native-dash';
import ThemeText from '../../../components/text';
import {ActiveReservation} from '../../../TicketContext';

type Props = {
  reservation: ActiveReservation;
};

const TicketReservation: React.FC<Props> = ({reservation}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  return (
    <TouchableOpacity>
      <View style={styles.ticketContainer}>
        <View style={styles.validityContainer}>
          <View style={styles.iconContainer}>
            <BlankTicket fill={colors.text.black} />
          </View>
          <ThemeText type="lead" color="faded">
            Prosesseres... ikke gylding enda
          </ThemeText>
        </View>
        <VerifyingValidityLine />
        <View style={styles.ticketInfoContainer}>
          <ThemeText style={styles.orderText}>
            Ordre-id {reservation.reservation.order_id}
          </ThemeText>
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
