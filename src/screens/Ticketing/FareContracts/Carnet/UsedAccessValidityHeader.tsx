import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  FareContractTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {secondsToDuration} from '@atb/utils/date';
import React from 'react';
import {View} from 'react-native';
import {UsedAccessStatus} from './types';
import TransportMode from '@atb/screens/Ticketing/FareContracts/Component/TransportMode';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';

type Props = {
  now: number;
  status: UsedAccessStatus;
  validFrom: number | undefined;
  validTo: number | undefined;
  isInspectable: boolean;
};

function UsedAccessValidityHeader(props: Props) {
  const styles = useStyles();
  const {t, language} = useTranslation();
  const usedAccessValidityText = getUsedAccessValidityText(props, t, language);
  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === 'carnet',
  );

  return (
    <View style={styles.validityHeader}>
      <View style={styles.validityContainer}>
        {fareProductTypeConfig && (
          <TransportMode
            modes={fareProductTypeConfig?.transportModes}
            disabled={props.status === 'inactive'}
          />
        )}
        <ThemeText
          style={styles.label}
          type="body__secondary"
          accessibilityLabel={
            !props.isInspectable
              ? usedAccessValidityText +
                ', ' +
                t(FareContractTexts.fareContractInfo.noInspectionIconA11yLabel)
              : undefined
          }
        >
          {usedAccessValidityText}
        </ThemeText>
      </View>
    </View>
  );
}

function getUsedAccessValidityText(
  props: Props,
  t: TranslateFunction,
  language: Language,
): string {
  const conjunction = t(FareContractTexts.validityHeader.durationDelimiter);
  const toDurationText = (seconds: number) =>
    secondsToDuration(seconds, language, {
      conjunction,
      serialComma: false,
    });

  const {status, now} = props;

  switch (status) {
    case 'valid': {
      const secondsUntilExpired = (props.validTo! - now) / 1000;
      const durationText = toDurationText(secondsUntilExpired);
      return t(FareContractTexts.validityHeader.valid(durationText));
    }
    case 'upcoming': {
      const secondsUntilValid = (props.validFrom! - now) / 1000;
      const durationText = toDurationText(secondsUntilValid);
      return t(FareContractTexts.validityHeader.upcoming(durationText));
    }
    case 'inactive':
      return t(FareContractTexts.validityHeader.inactiveCarnet);
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
  validityDashContainer: {
    marginVertical: theme.spacings.medium,
    marginHorizontal: -theme.spacings.medium,
    flexDirection: 'row',
  },
  label: {
    flex: 1,
    textAlign: 'right',
    marginLeft: theme.spacings.medium,
  },
}));

export default UsedAccessValidityHeader;
