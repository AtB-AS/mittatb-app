import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {formatToLongDateTime, secondsToDuration} from '../../../utils/date';
import {FareContract} from '../../../api/fareContracts';
import {StyleSheet} from '../../../theme';
import {InvalidTicket, ValidTicket} from '../../../assets/svg/icons/ticketing';
import colors from '../../../theme/colors';
import Dash from 'react-native-dash';
import {fromUnixTime} from 'date-fns';
import nb from 'date-fns/locale/nb';
import Text from '../../../components/text';

type Props = {
  fareContract: FareContract;
  now: number;
};

const Ticket: React.FC<Props> = ({fareContract: fc, now}) => {
  const styles = useStyles();

  const nowSeconds = now / 1000;
  const isValidTicket = fc.usage_valid_to >= nowSeconds;
  const validityLeftSeconds = fc.usage_valid_to - nowSeconds;

  return (
    <TouchableOpacity>
      <View style={styles.ticketContainer}>
        <View style={styles.validityContainer}>
          {isValidTicket ? (
            <>
              <View style={styles.iconContainer}>
                <ValidTicket fill={colors.primary.green} />
              </View>
              <Text style={styles.validityText}>
                Gyldig i{' '}
                {secondsToDuration(validityLeftSeconds, undefined, {
                  delimiter: ' og ',
                })}
              </Text>
            </>
          ) : (
            <>
              <View style={styles.iconContainer}>
                <InvalidTicket fill={colors.secondary.red} />
              </View>
              <Text style={styles.validityText}>
                Kjøpt{' '}
                {formatToLongDateTime(fromUnixTime(fc.usage_valid_from), nb)}
              </Text>
            </>
          )}
        </View>
        <ValidityLine
          isValid={isValidTicket}
          validityLeftSeconds={validityLeftSeconds}
          validFrom={fc.usage_valid_from}
          validTo={fc.usage_valid_to}
        />
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

const ValidityLine: React.FC<{
  isValid: boolean;
  validityLeftSeconds: number;
  validFrom: number;
  validTo: number;
}> = ({isValid, validityLeftSeconds, validFrom, validTo}) => {
  const styles = useStyles();

  if (isValid) {
    const durationSeconds = validTo - validFrom;
    const validityPercent = Math.ceil(
      (validityLeftSeconds / durationSeconds) * 100,
    );

    return (
      <View style={styles.validityDashContainer}>
        <Dash
          style={{width: `${validityPercent}%`}}
          dashGap={0}
          dashLength={1}
          dashThickness={8}
          dashColor={colors.primary.green}
        />
        <Dash
          style={{width: `${100 - validityPercent}%`}}
          dashGap={0}
          dashLength={1}
          dashThickness={8}
          dashColor={colors.secondary.gray_Level2}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.validityDashContainer}>
        <Dash
          style={{width: '100%'}}
          dashGap={0}
          dashLength={1}
          dashThickness={1}
          dashColor={colors.secondary.gray_Level2}
        />
      </View>
    );
  }
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
