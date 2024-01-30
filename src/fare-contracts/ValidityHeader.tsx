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
import {isValidFareContract, ValidityStatus} from './utils';
import {TransportModes} from '@atb/components/transportation-modes';
import {FareContractStatusSymbol} from './components/FareContractStatusSymbol';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {useMobileTokenContextState} from '@atb/mobile-token';

export const ValidityHeader: React.FC<{
  status: ValidityStatus;
  now: number;
  validFrom: number;
  validTo: number;
  fareProductType: string | undefined;
}> = ({status, now, validFrom, validTo, fareProductType}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === fareProductType,
  );
  const {deviceInspectionStatus} = useMobileTokenContextState();

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
        {isValidFareContract(status) ? (
          fareProductTypeConfig && (
            <TransportModes
              modes={fareProductTypeConfig.transportModes}
              iconSize="xSmall"
              style={{flex: 2}}
            />
          )
        ) : (
          <FareContractStatusSymbol status={status} />
        )}
        <ThemeText
          style={styles.label}
          type="body__secondary"
          accessibilityLabel={
            deviceInspectionStatus !== 'inspectable'
              ? validityTime +
                ', ' +
                t(FareContractTexts.fareContractInfo.noInspectionIconA11yLabel)
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
  const conjunction = t(FareContractTexts.validityHeader.durationDelimiter);
  const toDurationText = (seconds: number) =>
    secondsToDuration(seconds, language, {
      conjunction,
      serialComma: false,
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
    case 'unknown':
    default:
      return t(FareContractTexts.validityHeader.unknown);
  }
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
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
  label: {
    flex: 3,
    textAlign: 'right',
    marginLeft: theme.spacings.xLarge,
  },
}));
