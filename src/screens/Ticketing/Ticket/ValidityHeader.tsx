import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  TicketTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {formatToLongDateTime, secondsToDuration} from '@atb/utils/date';
import {toDate} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import {
  isValidTicket,
  ValidityStatus,
} from '@atb/screens/Ticketing/Ticket/utils';
import {PreassignedFareProductType} from '@atb/reference-data/types';
import TransportMode from '@atb/screens/Ticketing/Ticket/Component/TransportMode';
import TicketStatusSymbol from '@atb/screens/Ticketing/Ticket/Component/TicketStatusSymbol';

const ValidityHeader: React.FC<{
  status: ValidityStatus;
  now: number;
  validFrom: number;
  validTo: number;
  isInspectable: boolean;
  ticketType: PreassignedFareProductType | undefined;
}> = ({status, now, validFrom, validTo, isInspectable, ticketType}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();

  const validityTime: string = validityTimeText(
    status,
    now,
    validFrom,
    validTo,
    t,
    language,
  );

  return (
    <View style={styles.validityHeader}>
      <View style={styles.validityContainer}>
        {isValidTicket(status) ? (
          ticketType && <TransportMode ticketType={ticketType} />
        ) : (
          <TicketStatusSymbol status={status} />
        )}
        <ThemeText
          style={styles.label}
          type="body__secondary"
          accessibilityLabel={
            !isInspectable
              ? validityTime +
                ', ' +
                t(TicketTexts.ticketInfo.noInspectionIconA11yLabel)
              : undefined
          }
        >
          {validityTime}
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
        const dateTime = formatToLongDateTime(toDate(validTo), language);
        return t(TicketTexts.validityHeader.expired(dateTime));
      }
    }
    case 'reserving':
      return t(TicketTexts.validityHeader.reserving);
    case 'unknown':
    default:
      return t(TicketTexts.validityHeader.unknown);
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  iconContainer: {marginRight: theme.spacings.medium},
  ticketContainer: {
    backgroundColor: theme.static.background.background_0.background,
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
    justifyContent: 'space-between',
    flex: 1,
  },
  transportationMode: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityDashContainer: {
    marginVertical: theme.spacings.medium,
    marginHorizontal: -theme.spacings.medium,
    flexDirection: 'row',
  },
  label: {
    flex: 1,
    textAlign: 'right',
    marginLeft: theme.spacings.xLarge,
  },
}));

export default ValidityHeader;
