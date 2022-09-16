import ThemeText from '@atb/components/text';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {TicketTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {AccessibilityProps, View} from 'react-native';
import {tariffZonesSummary} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {
  getNonInspectableTokenWarning,
  isValidTicket,
  userProfileCountAndName,
} from '@atb/screens/Ticketing/Ticket/utils';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {secondsToDuration} from '@atb/utils/date';
import {TicketInfoDetailsProps} from './TicketInfo';
import * as Sections from '@atb/components/sections';
import {screenReaderPause} from '@atb/components/accessible-text';
import InspectionSymbol from '@atb/screens/Ticketing/Ticket/Component/InspectionSymbol';

type CompactTicketInfoProps = TicketInfoDetailsProps & {
  onPressDetails?: () => void;
};

type TicketInfoTextsProps = {
  productName?: string;
  tariffZoneSummary?: string;
  timeUntilExpire?: string;
  accessibilityLabel?: string;
};

export type CompactTicketInfoTextsProps = CompactTicketInfoProps &
  TicketInfoTextsProps;

export const CompactTicketInfo = (props: CompactTicketInfoProps) => {
  const styles = useStyles();
  const {status} = props;
  const isValid = isValidTicket(status);
  const {isLoading} = useMobileTokenContextState();

  const ticketTexts = useTicketInfoTexts(props);
  const ticketInfoTextsProps = {
    ...ticketTexts,
    ...props,
  };

  const {accessibilityLabel} = ticketTexts;

  const accessibility: AccessibilityProps = {
    accessible: true,
    accessibilityRole: 'button',
    accessibilityLabel: accessibilityLabel,
  };

  return (
    <Sections.Section withPadding {...accessibility}>
      <Sections.GenericClickableItem onPress={props.onPressDetails}>
        <View style={styles.container}>
          <View style={styles.ticketDetails}>
            <CompactTicketInfoTexts {...ticketInfoTextsProps} />
            {isValid && <InspectionSymbol {...props} isLoading={isLoading} />}
          </View>
        </View>
      </Sections.GenericClickableItem>
    </Sections.Section>
  );
};

const CompactTicketInfoTexts = (props: CompactTicketInfoTextsProps) => {
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
        <ThemeText type="body__secondary">
          {userProfileCountAndName(u, omitUserProfileCount, language)}
        </ThemeText>
      ))}
      {productName && (
        <ThemeText type="body__secondary">{productName}</ThemeText>
      )}
      {tariffZoneSummary && (
        <ThemeText type="body__secondary">{tariffZoneSummary}</ThemeText>
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

export const useTicketInfoTexts = (
  props: CompactTicketInfoProps,
): TicketInfoTextsProps => {
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
  const conjunction = t(TicketTexts.validityHeader.durationDelimiter);
  const durationText = secondsToDuration(secondsUntilValid, language, {
    conjunction,
    serialComma: false,
  });

  var accessibilityLabel: string = '';
  var timeUntilExpireOrWarning: string | undefined;

  if (isInspectable) {
    timeUntilExpireOrWarning = t(
      TicketTexts.validityHeader.valid(durationText),
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
    accessibilityLabel += t(TicketTexts.ticketInfo.noInspectionIconA11yLabel);
  }

  return {
    productName,
    tariffZoneSummary,
    timeUntilExpire: timeUntilExpireOrWarning,
    accessibilityLabel,
  };
};

export default CompactTicketInfo;
