import React from 'react';
import {View} from 'react-native';
import {formatToLongDateTime, secondsToDuration} from '../../../utils/date';
import {fromUnixTime} from 'date-fns';
import {Context} from '../../../assets/svg/icons/actions';
import Button from '../../../components/button';
import ThemeText from '../../../components/text';
import {StyleSheet} from '../../../theme';
import ValidityIcon from './ValidityIcon';
import {
  Language,
  TicketTexts,
  TranslateFunction,
  useTranslation,
} from '../../../translations';

const ValidityHeader: React.FC<{
  isValid: boolean;
  nowSeconds: number;
  validTo: number;
  isRefunded: boolean;
  onPressDetails?: () => void;
}> = ({isValid, nowSeconds, validTo, isRefunded, onPressDetails}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  return (
    <View style={styles.validityHeader}>
      <View style={styles.validityContainer}>
        <ValidityIcon isValid={isValid} />
        <ThemeText type="lead" color="faded">
          {validityTimeText(
            isValid,
            nowSeconds,
            validTo,
            isRefunded,
            t,
            language,
          )}
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
  isRefunded: boolean,
  t: TranslateFunction,
  language: Language,
) {
  const validityDifferenceSeconds = Math.abs(validTo - nowSeconds);
  const delimiter = t(TicketTexts.validityHeader.durationDelimiter);
  const duration = secondsToDuration(validityDifferenceSeconds, language, {
    delimiter,
  });

  if (isValid) {
    return t(TicketTexts.validityHeader.valid(duration));
  } else if (isRefunded) {
    return t(TicketTexts.validityHeader.refunded);
  } else {
    if (validityDifferenceSeconds < 60 * 60) {
      return t(TicketTexts.validityHeader.recentlyExpired(duration));
    } else {
      const dateTime = formatToLongDateTime(fromUnixTime(validTo), language);
      return t(TicketTexts.validityHeader.expired(dateTime));
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
