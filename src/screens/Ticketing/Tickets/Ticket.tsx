import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {formatToLongDateTime, secondsToDuration} from '../../../utils/date';
import {FareContract} from '../../../api/fareContracts';
import {StyleSheet, useTheme} from '../../../theme';
import {InvalidTicket, ValidTicket} from '../../../assets/svg/icons/ticketing';
import colors from '../../../theme/colors';
import Dash from 'react-native-dash';
import {fromUnixTime, isValid} from 'date-fns';
import nb from 'date-fns/locale/nb';
import ThemeText from '../../../components/text';
import {screenReaderPause} from '../../../components/accessible-text';
import * as Sections from '../../../components/sections';
import {Close, Context} from '../../../assets/svg/icons/actions';
import ThemeIcon from '../../../components/theme-icon';
import Button from '../../../components/button';
type Props = {
  fareContract: FareContract;
  now: number;
  onPress: () => void;
};

const Ticket: React.FC<Props> = ({fareContract: fc, now, onPress}) => {
  const styles = useStyles();
  const {theme} = useTheme();

  const nowSeconds = now / 1000;
  const isValidTicket = fc.usage_valid_to >= nowSeconds;
  const validityLeftSeconds = fc.usage_valid_to - nowSeconds;

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <View style={styles.validityHeader}>
          <View style={styles.validityContainer}>
            <ValidityIcon isValid={isValidTicket} />
            <ThemeText type="lead" color="faded">
              {isValidTicket
                ? `Gyldig i ${secondsToDuration(validityLeftSeconds, {
                    delimiter: ' og ',
                  })}`
                : `Kjøpt ${formatToLongDateTime(
                    fromUnixTime(fc.usage_valid_from),
                    nb,
                  )}`}
            </ThemeText>
          </View>
          <Button
            type="compact"
            mode="tertiary"
            icon={Context}
            style={{padding: 0}}
            onPress={onPress}
          />
        </View>
        <ValidityLine
          isValid={isValidTicket}
          validityLeftSeconds={validityLeftSeconds}
          validFrom={fc.usage_valid_from}
          validTo={fc.usage_valid_to}
        />
        <ThemeText>
          {fc.user_profiles.length > 1
            ? `${fc.user_profiles.length} voksne`
            : `1 voksen`}
        </ThemeText>
        <ThemeText type="lead" color="faded">
          {fc.product_name}
        </ThemeText>
        <ThemeText type="lead" color="faded">
          Sone A - Stor-Trondheim
        </ThemeText>
      </Sections.GenericItem>
      {isValidTicket && <Sections.LinkItem text="Vis for kontroll" />}
    </Sections.Section>
  );
};

const ValidityIcon: React.FC<{isValid: boolean}> = ({isValid}) => {
  const {theme} = useTheme();

  return (
    <View style={{marginRight: theme.spacings.medium}}>
      {isValid ? (
        <ValidTicket
          fill={colors.primary.green_500}
          accessibilityLabel={'Gyldig billett' + screenReaderPause}
        />
      ) : (
        <InvalidTicket
          fill={theme.border.error}
          accessibilityLabel={'Utløpt billett' + screenReaderPause}
        />
      )}
    </View>
  );
};

const ValidityLine: React.FC<{
  isValid: boolean;
  validityLeftSeconds: number;
  validFrom: number;
  validTo: number;
}> = ({isValid, validityLeftSeconds, validFrom, validTo}) => {
  const styles = useStyles();
  const {theme} = useTheme();

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
          dashColor={colors.primary.green_500}
        />
        <Dash
          style={{width: `${100 - validityPercent}%`}}
          dashGap={0}
          dashLength={1}
          dashThickness={8}
          dashColor={colors.primary.gray_500}
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
          dashColor={theme.background.level1}
        />
      </View>
    );
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  iconContainer: {marginRight: theme.spacings.medium},
  ticketContainer: {
    backgroundColor: theme.background.level0,
    borderRadius: theme.border.radius.regular,
    marginBottom: theme.spacings.medium,
  },
  validityHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityDashContainer: {
    marginVertical: theme.spacings.medium,
    marginHorizontal: -theme.spacings.medium,
    flexDirection: 'row',
  },
}));

export default Ticket;
