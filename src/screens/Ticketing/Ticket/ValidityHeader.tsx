import React from 'react';
import {View} from 'react-native';
import {formatToLongDateTime, secondsToDuration} from '../../../utils/date';
import {fromUnixTime} from 'date-fns';
import nb from 'date-fns/locale/nb';
import {Context} from '../../../assets/svg/icons/actions';
import Button from '../../../components/button';
import ThemeText from '../../../components/text';
import {StyleSheet} from '../../../theme';
import ValidityIcon from './ValidityIcon';

const ValidityHeader: React.FC<{
  isValid: boolean;
  nowSeconds: number;
  validTo: number;
  onPressDetails?: () => void;
}> = ({isValid, nowSeconds, validTo, onPressDetails}) => {
  const styles = useStyles();

  return (
    <View style={styles.validityHeader}>
      <View style={styles.validityContainer}>
        <ValidityIcon isValid={isValid} />
        <ThemeText type="lead" color="faded">
          {validityTimeText(isValid, nowSeconds, validTo)}
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

function validityTimeText(
  isValid: boolean,
  nowSeconds: number,
  validTo: number,
) {
  const validityDifferenceSeconds = Math.abs(validTo - nowSeconds);

  if (isValid) {
    return `Gyldig i ${secondsToDuration(validityDifferenceSeconds, {
      delimiter: ' og ',
    })}`;
  } else {
    if (validityDifferenceSeconds < 60 * 60) {
      return `Utløpt for ${secondsToDuration(validityDifferenceSeconds, {
        delimiter: ' og ',
      })} siden`;
    } else {
      return `Utløpt ${formatToLongDateTime(fromUnixTime(validTo), nb)}`;
    }
  }
}

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
