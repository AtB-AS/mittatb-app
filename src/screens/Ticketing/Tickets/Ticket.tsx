import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {secondsToDuration} from '../../../utils/date';
import {FareContract} from '../../../api/fareContracts';
import {StyleSheet} from '../../../theme';
import {ValidTicket} from '../../../assets/svg/icons/ticketing';
import colors from '../../../theme/colors';
import Dash from 'react-native-dash';

type Props = {
  fareContract: FareContract;
  now: number;
};

const Ticket: React.FC<Props> = ({fareContract: fc, now}) => {
  const styles = useStyles();

  const validitySeconds = fc.usage_valid_to - now / 1000;
  const durationSeconds = fc.usage_valid_to - fc.usage_valid_from;
  const validityPercent = Math.ceil((validitySeconds / durationSeconds) * 100);
  return (
    <TouchableOpacity>
      <View style={styles.ticketContainer}>
        <View style={styles.validityContainer}>
          <View style={styles.iconContainer}>
            <ValidTicket fill={colors.primary.green} />
          </View>
          <Text style={styles.validityText}>
            Gyldig i{' '}
            {secondsToDuration(validitySeconds, undefined, {
              delimiter: ' og ',
            })}
          </Text>
        </View>
        <View style={styles.validityDashContainer}>
          <Dash
            style={{width: `${validityPercent}%`}}
            dashGap={0}
            dashLength={1}
            dashThickness={4}
            dashColor={colors.primary.green}
          />
          <Dash
            style={{width: `${100 - validityPercent}%`}}
            dashGap={0}
            dashLength={1}
            dashThickness={4}
            dashColor={colors.secondary.gray_Level2}
          />
        </View>
        <View style={styles.ticketInfoContainer}>
          <Text style={styles.travellersText}>
            {fc.user_profiles.length > 1
              ? `${fc.user_profiles.length} voksne`
              : `1 voksen`}
          </Text>
          <Text style={styles.extraText}>{fc.product_name}</Text>
          <Text style={styles.extraText}>Sone A - Stor-Trondheim</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  iconContainer: {marginRight: theme.spacings.medium},
  validityText: {
    fontSize: theme.text.sizes.lead,
    color: theme.text.colors.faded,
  },
  travellersText: {
    fontSize: theme.text.sizes.body,
    paddingVertical: theme.spacings.xSmall,
  },
  ticketContainer: {
    backgroundColor: theme.background.level0,
    borderRadius: 8,
    marginBottom: theme.spacings.medium,
  },
  extraText: {
    fontSize: theme.text.sizes.lead,
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

export default Ticket;
