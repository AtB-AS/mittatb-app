import {screenReaderPause, ThemeText} from '@atb/components/text';
import {getReferenceDataName} from '@atb/configuration';
import {StyleSheet} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {AccessibilityProps, StyleProp, View, ViewStyle} from 'react-native';
import {
  isValidFareContract,
  useNonInspectableTokenWarning,
  userProfileCountAndName,
  useTariffZoneSummary,
} from '@atb/fare-contracts/utils';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {secondsToDuration} from '@atb/utils/date';
import {FareContractInfoDetailsProps} from './FareContractInfo';
import {InspectionSymbol} from '@atb/fare-contracts/components/InspectionSymbol';
import {GenericClickableSectionItem, Section} from '@atb/components/sections';

type CompactFareContractInfoProps = FareContractInfoDetailsProps & {
  style?: StyleProp<ViewStyle>;
  onPressDetails?: () => void;
};

type FareContractInfoTextsProps = {
  productName?: string;
  tariffZoneSummary?: string;
  timeUntilExpire?: string;
  accessibilityLabel?: string;
};

export type CompactFareContractInfoTextsProps = CompactFareContractInfoProps &
  FareContractInfoTextsProps;

export const CompactFareContractInfo = (
  props: CompactFareContractInfoProps,
) => {
  const styles = useStyles();
  const {status} = props;
  const isValid = isValidFareContract(status);

  const fareContractTexts = useFareContractInfoTexts(props);
  const fareContractInfoTextsProps = {
    ...fareContractTexts,
    ...props,
  };

  const {accessibilityLabel} = fareContractTexts;

  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: accessibilityLabel,
  };

  return (
    <Section style={props.style} {...accessibility}>
      <GenericClickableSectionItem onPress={props.onPressDetails}>
        <View style={styles.container}>
          <View style={styles.ticketDetails}>
            <CompactFareContractInfoTexts {...fareContractInfoTextsProps} />
            {isValid && <InspectionSymbol {...props} />}
          </View>
        </View>
      </GenericClickableSectionItem>
    </Section>
  );
};

const CompactFareContractInfoTexts = (
  props: CompactFareContractInfoTextsProps,
) => {
  const {
    userProfilesWithCount,
    productName,
    tariffZoneSummary,
    timeUntilExpire,
  } = props;
  const {language} = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.textsContainer}>
      <ThemeText type="body__primary--bold" style={styles.expireTime}>
        {timeUntilExpire}
      </ThemeText>
      {userProfilesWithCount.map((u) => (
        <ThemeText key={u.id} type="body__secondary" color="secondary">
          {userProfileCountAndName(u, language)}
        </ThemeText>
      ))}
      {productName && (
        <ThemeText type="body__secondary" color="secondary">
          {productName}
        </ThemeText>
      )}
      {tariffZoneSummary && (
        <ThemeText type="body__secondary" color="secondary">
          {tariffZoneSummary}
        </ThemeText>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flex: 1},
  ticketDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textsContainer: {flex: 1, paddingTop: theme.spacings.xSmall},
  expireTime: {
    marginBottom: theme.spacings.small,
  },
  symbolContainer: {
    minHeight: 72,
    minWidth: 72,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
}));

export const useFareContractInfoTexts = (
  props: CompactFareContractInfoProps,
): FareContractInfoTextsProps => {
  const {
    userProfilesWithCount,
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    validTo,
    now,
  } = props;

  const {t, language} = useTranslation();
  const {deviceInspectionStatus} = useMobileTokenContextState();

  const productName = preassignedFareProduct
    ? getReferenceDataName(preassignedFareProduct, language)
    : undefined;

  const tariffZoneSummary = useTariffZoneSummary(
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
  );

  const secondsUntilValid = ((validTo || 0) - (now || 0)) / 1000;
  const conjunction = t(FareContractTexts.validityHeader.durationDelimiter);
  const durationText = secondsToDuration(secondsUntilValid, language, {
    conjunction,
    serialComma: false,
  });

  const tokenWarning = useNonInspectableTokenWarning();
  const timeUntilExpireOrWarning: string | undefined =
    tokenWarning ?? t(FareContractTexts.validityHeader.valid(durationText));

  let accessibilityLabel: string = '';
  accessibilityLabel += timeUntilExpireOrWarning + screenReaderPause;
  accessibilityLabel += userProfilesWithCount.map(
    (u) =>
      userProfileCountAndName(u, language) +
      screenReaderPause,
  );
  accessibilityLabel += productName + screenReaderPause;
  accessibilityLabel += tariffZoneSummary + screenReaderPause;

  if (deviceInspectionStatus !== 'inspectable') {
    accessibilityLabel += t(
      FareContractTexts.fareContractInfo.noInspectionIconA11yLabel,
    );
  }

  return {
    productName,
    tariffZoneSummary,
    timeUntilExpire: timeUntilExpireOrWarning,
    accessibilityLabel,
  };
};
