import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  FareContractTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {formatToLongDateTime, secondsToDuration} from '@atb/utils/date';
import {toDate} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import {
  fareContractValidityUnits,
  getFareContractInfo,
  ValidityStatus,
} from '../utils';
import {useMobileTokenContext} from '@atb/mobile-token';
import {useTimeContext} from '@atb/time';
import {useAuthContext} from '@atb/auth';
import type {FareContractType} from '@atb-as/utils';

type Props = {
  fc: FareContractType;
};

export const ValidityTime = ({fc}: Props) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {isInspectable} = useMobileTokenContext();
  const {serverNow} = useTimeContext();
  const {abtCustomerId: currentUserId} = useAuthContext();

  const {validityStatus, validFrom, validTo} = getFareContractInfo(
    serverNow,
    fc,
    currentUserId,
  );
  const label: string = validityTimeText(
    validityStatus,
    serverNow,
    fc.created.getTime(),
    validFrom,
    validTo,
    t,
    language,
  );

  return (
    <View>
      <ThemeText
        style={styles.validityText}
        typography="heading--medium"
        accessibilityLabel={
          !isInspectable
            ? label +
              ', ' +
              t(FareContractTexts.fareContractInfo.noInspectionIconA11yLabel)
            : undefined
        }
      >
        {label}
      </ThemeText>
    </View>
  );
};

function validityTimeText(
  status: ValidityStatus,
  now: number,
  createdDate: number,
  validFrom: number,
  validTo: number,
  t: TranslateFunction,
  language: Language,
): string {
  const conjunction = t(FareContractTexts.validityHeader.durationDelimiter);
  const toDurationText = (seconds: number) =>
    secondsToDuration(seconds, language, {
      conjunction,
      serialComma: false,
      units: fareContractValidityUnits(seconds),
    });

  switch (status) {
    case 'refunded':
      return t(FareContractTexts.validityHeader.refunded);
    case 'cancelled':
      return t(FareContractTexts.validityHeader.cancelled);
    case 'upcoming': {
      const secondsUntilValid = (validFrom - now) / 1000;
      const durationText = toDurationText(secondsUntilValid);
      return t(FareContractTexts.validityHeader.upcoming(durationText));
    }
    case 'valid': {
      const secondsUntilExpired = (validTo - now) / 1000;
      const durationText = toDurationText(secondsUntilExpired);
      return t(FareContractTexts.validityHeader.valid(durationText));
    }
    case 'expired': {
      const secondsSinceExpired = (now - validTo) / 1000;
      if (secondsSinceExpired < 60 * 60) {
        const durationText = toDurationText(secondsSinceExpired);
        return t(
          FareContractTexts.validityHeader.recentlyExpired(durationText),
        );
      } else {
        const dateTime = formatToLongDateTime(toDate(validTo), language);
        return t(FareContractTexts.validityHeader.expired(dateTime));
      }
    }
    case 'reserving':
      return t(FareContractTexts.validityHeader.reserving);
    case 'sent':
      const dateTime = formatToLongDateTime(toDate(createdDate), language);
      return t(FareContractTexts.validityHeader.sent(dateTime));
    case 'inactive':
      return t(FareContractTexts.validityHeader.inactiveCarnet);
    default:
      return t(FareContractTexts.validityHeader.unknown);
  }
}

const useStyles = StyleSheet.createThemeHook(() => ({
  validityText: {
    textAlign: 'center',
  },
}));
