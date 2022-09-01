import ThemeText from '@atb/components/text';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {
  Language,
  TicketTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {AccessibilityProps, View} from 'react-native';
import {tariffZonesSummary} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {
  isValidTicket,
  userProfileCountAndName,
} from '@atb/screens/Ticketing/Ticket/utils';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {secondsToDuration} from '@atb/utils/date';
import {TicketInfoDetailsProps} from './TicketInfo';
import LoadingSymbol from './Component/LoadingSymbol';
import * as Sections from '@atb/components/sections';
import {screenReaderPause} from '@atb/components/accessible-text';
import InspectionSymbol from '@atb/screens/Ticketing/Ticket/Component/InspectionSymbol';
import {isInspectable} from '@atb/mobile-token/utils';

export type CompactTicketInfoProps = TicketInfoDetailsProps & {
  onPressDetails?: () => void;
};

export type TicketInfoTextsProps = {
  productName?: string;
  tariffZoneSummary?: string;
  timeUntilExpire?: string;
  accessibilityLabel?: string;
};

export type CompactTicketInfoTexts = CompactTicketInfoProps &
  TicketInfoTextsProps;

export const CompactTicketInfo = (props: CompactTicketInfoProps) => {
  const styles = useStyles();
  const {status} = props;
  const isValid = isValidTicket(status);
  const {isLoading} = useMobileTokenContextState();
  const {t, language} = useTranslation();

  const ticketTexts = getTicketInfoTexts(props, t, language);
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
            {isLoading && <LoadingSymbol />}
            {isValid && !isLoading && <InspectionSymbol {...props} />}
          </View>
        </View>
      </Sections.GenericClickableItem>
    </Sections.Section>
  );
};

const CompactTicketInfoTexts = (props: CompactTicketInfoTexts) => {
  const {
    userProfilesWithCount,
    omitUserProfileCount,
    productName,
    tariffZoneSummary,
    timeUntilExpire,
  } = props;
  const {t, language} = useTranslation();
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

export const getTicketInfoTexts = (
  props: CompactTicketInfoProps,
  t: TranslateFunction,
  language: Language,
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
  const timeUntilExpire = t(TicketTexts.validityHeader.valid(durationText));

  var accessibilityLabel = timeUntilExpire + screenReaderPause;
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
    timeUntilExpire,
    accessibilityLabel,
  };
};

export default CompactTicketInfo;
