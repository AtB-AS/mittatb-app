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
import ValidityIcon from '../ValidityIcon';
import {
  RelativeValidityStatus,
  ValidityStatus,
} from '@atb/screens/Ticketing/Ticket/utils';

const ValidityHeader: React.FC<{
  now: number;
  fareContractStatus: ValidityStatus;
  usedAccessStatus: RelativeValidityStatus;
  usedAccessValidFrom: number;
  usedAccessValidTo: number;
  maximumNumberOfAccesses: number;
  numberOfUsedAccesses: number;
}> = ({
  usedAccessStatus,
  now,
  usedAccessValidFrom,
  usedAccessValidTo,
  maximumNumberOfAccesses,
  numberOfUsedAccesses,
}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  return (
    <View style={styles.validityHeader}>
      <View style={styles.validityContainer}>
        <ValidityIcon status={usedAccessStatus} />
        <ThemeText style={styles.validityText} type="body__secondary">
          {validityTimeText(
            usedAccessStatus,
            now,
            usedAccessValidFrom,
            usedAccessValidTo,
            t,
            language,
          )}
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
): string {
  const conjunction = t(TicketTexts.validityHeader.durationDelimiter);
  const toDurationText = (seconds: number) =>
    secondsToDuration(seconds, language, {
      conjunction,
      serialComma: false,
    });

  switch (status) {
    case 'refunded':
      return t(TicketTexts.validityHeader.refunded);
    case 'upcoming': {
      const secondsUntilValid = (validFrom - now) / 1000;
      const durationText = toDurationText(secondsUntilValid);
      return t(TicketTexts.validityHeader.upcoming(durationText));
    }
    case 'valid': {
      const secondsUntilExpired = (validTo - now) / 1000;
      const durationText = toDurationText(secondsUntilExpired);
      return t(TicketTexts.validityHeader.valid(durationText));
    }
    case 'expired': {
      const secondsSinceExpired = (now - validTo) / 1000;
      if (secondsSinceExpired < 60 * 60) {
        const durationText = toDurationText(secondsSinceExpired);
        return t(TicketTexts.validityHeader.recentlyExpired(durationText));
      } else {
        const dateTime = formatToLongDateTime(
          fromUnixTime(validTo / 1000),
          language,
        );
        return t(TicketTexts.validityHeader.expired(dateTime));
      }
    }
    case 'reserving':
      return t(TicketTexts.validityHeader.reserving);
    case 'unknown':
      return t(TicketTexts.validityHeader.unknown);
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  iconContainer: {marginRight: theme.spacings.medium},
  ticketContainer: {
    backgroundColor: theme.colors.background_0.backgroundColor,
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
