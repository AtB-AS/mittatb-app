import {ThemeText} from '@atb/components/text';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {AccessibilityProps, View} from 'react-native';
import {
  getNonInspectableTokenWarning,
  isValidFareContract,
  tariffZonesSummary,
  userProfileCountAndName,
} from '@atb/fare-contracts/utils';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {secondsToDuration} from '@atb/utils/date';
import {FareContractInfoDetailsProps} from './FareContractInfo';
import * as Sections from '@atb/components/sections';
import {screenReaderPause} from '@atb/components/text';
import InspectionSymbol from '@atb/fare-contracts/Component/InspectionSymbol';

type CompactFareContractInfoProps = FareContractInfoDetailsProps & {
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
  const {isLoading} = useMobileTokenContextState();

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
    <Sections.Section withPadding {...accessibility}>
      <Sections.GenericClickableSectionItem onPress={props.onPressDetails}>
        <View style={styles.container}>
          <View style={styles.ticketDetails}>
            <CompactFareContractInfoTexts {...fareContractInfoTextsProps} />
            {isValid && <InspectionSymbol {...props} isLoading={isLoading} />}
          </View>
        </View>
      </Sections.GenericClickableSectionItem>
    </Sections.Section>
  );
};

const CompactFareContractInfoTexts = (
  props: CompactFareContractInfoTextsProps,
) => {
  const {
    userProfilesWithCount,
    omitUserProfileCount,
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
          {userProfileCountAndName(u, omitUserProfileCount, language)}
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
    omitUserProfileCount,
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    validTo,
    now,
    isInspectable,
  } = props;

  const {t, language} = useTranslation();
  const {isError, remoteTokens, fallbackEnabled} = useMobileTokenContextState();

  const productName = preassignedFareProduct
    ? getReferenceDataName(preassignedFareProduct, language)
    : undefined;

  const tariffZoneSummary =
    fromTariffZone && toTariffZone
      ? tariffZonesSummary(fromTariffZone, toTariffZone, language, t)
      : undefined;

  const secondsUntilValid = ((validTo || 0) - (now || 0)) / 1000;
  const conjunction = t(FareContractTexts.validityHeader.durationDelimiter);
  const durationText = secondsToDuration(secondsUntilValid, language, {
    conjunction,
    serialComma: false,
  });

  var accessibilityLabel: string = '';
  var timeUntilExpireOrWarning: string | undefined;

  if (isInspectable) {
    timeUntilExpireOrWarning = t(
      FareContractTexts.validityHeader.valid(durationText),
    );
  } else {
    const warning = getNonInspectableTokenWarning(
      isError,
      fallbackEnabled,
      t,
      remoteTokens,
      isInspectable,
      preassignedFareProduct?.type,
    );

    timeUntilExpireOrWarning = warning ?? undefined;
  }

  accessibilityLabel += timeUntilExpireOrWarning + screenReaderPause;
  accessibilityLabel += userProfilesWithCount.map(
    (u) =>
      userProfileCountAndName(u, omitUserProfileCount, language) +
      screenReaderPause,
  );
  accessibilityLabel += productName + screenReaderPause;
  accessibilityLabel += tariffZoneSummary + screenReaderPause;

  if (!isInspectable) {
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

export default CompactFareContractInfo;
