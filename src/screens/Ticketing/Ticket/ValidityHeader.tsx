import React from 'react';
import {View} from 'react-native';
import {formatToLongDateTime, secondsToDuration} from '../../../utils/date';
import {fromUnixTime} from 'date-fns';
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
  isNotExpired: boolean;
  isRefunded: boolean;
}> = ({isValid, nowSeconds, validTo, isNotExpired, isRefunded}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  return (
    <View style={styles.validityHeader}>
      <View style={styles.validityContainer}>
        <ValidityIcon isValid={isValid} />
        <ThemeText style={styles.validityText} type="lead" color="faded">
          {validityTimeText(
            isNotExpired,
            nowSeconds,
            validTo,
            isRefunded,
            t,
            language,
          )}
        </ThemeText>
      </View>
    </View>
  );
};

function validityTimeText(
  isNotExpired: boolean,
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

  if (isRefunded) {
    return t(TicketTexts.validityHeader.refunded);
  } else if (isNotExpired) {
    return t(TicketTexts.validityHeader.valid(duration));
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
  validityText: {
    flex: 1,
  },
}));

export default ValidityHeader;
