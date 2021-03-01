import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  TicketTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {formatToLongDateTime, secondsToDuration} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import ValidityIcon from './ValidityIcon';
import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';

const ValidityHeader: React.FC<{
  status: ValidityStatus;
  now: number;
  validFrom: number;
  validTo: number;
}> = ({status, now, validFrom, validTo}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  return (
    <View style={styles.validityHeader}>
      <View style={styles.validityContainer}>
        <ValidityIcon status={status} />
        <ThemeText style={styles.validityText} type="lead">
          {validityTimeText(status, now, validFrom, validTo, t, language)}
        </ThemeText>
      </View>
    </View>
  );
};

function validityTimeText(
  status: ValidityStatus,
  now: number,
  validFrom: number,
  validTo: number,
  t: TranslateFunction,
  language: Language,
) {
  const validityDifferenceSeconds = Math.abs(validTo - now) / 1000;
  const conjunction = t(TicketTexts.validityHeader.durationDelimiter);
  const duration = secondsToDuration(validityDifferenceSeconds, language, {
    conjunction,
    serialComma: false,
  });

  if (status === 'refunded') {
    return t(TicketTexts.validityHeader.refunded);
  } else if (status === 'upcoming') {
    const secondsUntilValid = Math.abs(now - validFrom) / 1000;
    const untilValidDuration = secondsToDuration(secondsUntilValid, language, {
      conjunction,
      serialComma: false,
    });
    return t(TicketTexts.validityHeader.upcoming(untilValidDuration));
  } else if (status === 'valid') {
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
