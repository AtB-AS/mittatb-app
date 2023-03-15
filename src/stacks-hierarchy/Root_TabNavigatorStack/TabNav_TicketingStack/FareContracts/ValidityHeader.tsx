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
  isValidFareContract,
  ValidityStatus,
} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import {TransportMode} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/Component/TransportMode';
import FareContractStatusSymbol from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/Component/FareContractStatusSymbol';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

export const ValidityHeader: React.FC<{
  status: ValidityStatus;
  now: number;
  validFrom: number;
  validTo: number;
  isInspectable: boolean;
  fareProductType: string | undefined;
}> = ({status, now, validFrom, validTo, isInspectable, fareProductType}) => {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === fareProductType,
  );

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
            <TransportMode
              modes={fareProductTypeConfig.transportModes}
              iconSize={'small'}
            />
          )
        ) : (
          <FareContractStatusSymbol status={status} />
        )}
        <ThemeText
          style={styles.label}
          type="body__secondary"
          accessibilityLabel={
            !isInspectable
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
  iconContainer: {marginRight: theme.spacings.medium},
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
    flex: 3,
    textAlign: 'right',
    marginLeft: theme.spacings.xLarge,
  },
}));
