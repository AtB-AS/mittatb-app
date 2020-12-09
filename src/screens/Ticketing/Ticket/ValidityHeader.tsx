import React from 'react';
import {View} from 'react-native';
import {formatToLongDateTime, secondsToDuration} from '../../../utils/date';
import {fromUnixTime} from 'date-fns';
import nb from 'date-fns/locale/nb';
import {Context} from '../../../assets/svg/icons/actions';
import Button from '../../../components/button';
import ThemeText from '../../../components/text';
import {StyleSheet, useTheme} from '../../../theme';
import ValidityIcon from './ValidityIcon';
import {FareContract} from '../../../api/fareContracts';
import ValidityLine from './ValidityLine';

const ValidityHeader: React.FC<{
  isValid: boolean;
  timeLeft: number;
  validFrom: number;
  onPressDetails?: () => void;
}> = ({isValid, timeLeft, validFrom, onPressDetails}) => {
  const styles = useStyles();

  return (
    <View style={styles.validityHeader}>
      <View style={styles.validityContainer}>
        <ValidityIcon isValid={isValid} />
        <ThemeText type="lead" color="faded">
          {isValid
            ? `Gyldig i ${secondsToDuration(timeLeft, {
                delimiter: ' og ',
              })}`
            : `Kjøpt ${formatToLongDateTime(fromUnixTime(validFrom), nb)}`}
        </ThemeText>
      </View>
      {onPressDetails && (
        <Button
          type="compact"
          mode="tertiary"
          icon={Context}
          style={{padding: 0}}
          onPress={onPressDetails}
        />
      )}
    </View>
  );
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

export default ValidityHeader;
