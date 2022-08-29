import ThemeText from '@atb/components/text';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {TicketTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {tariffZonesSummary} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {
  getNonInspectableTokenWarning,
  isValidTicket,
  userProfileCountAndName,
} from '@atb/screens/Ticketing/Ticket/utils';
import {screenReaderPause} from '@atb/components/accessible-text';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import WarningMessage from '@atb/screens/Ticketing/Ticket/Component/WarningMessage';
import ZoneSymbol from '@atb/screens/Ticketing/Ticket/Component/ZoneSymbol';
import {secondsToDuration} from '@atb/utils/date';
import {TicketInfoDetailsProps} from './TicketInfo';

export const CompactTicketInfo = (props: TicketInfoDetailsProps) => {
  const styles = useStyles();
  const {status, isInspectable} = props;
  return (
    <View style={styles.container}>
      <CompactTicketInfoTexts {...props} />
      {isValidTicket(status) && isInspectable && <ZoneSymbol {...props} />}
    </View>
  );
};

const CompactTicketInfoTexts = (props: TicketInfoDetailsProps) => {
  const {
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
    isInspectable,
    omitUserProfileCount,
    testID,
    validTo,
    now,
  } = props;
  const {t, language} = useTranslation();
  const styles = useStyles();

  const productName = preassignedFareProduct
    ? getReferenceDataName(preassignedFareProduct, language)
    : undefined;

  const tariffZoneSummary =
    fromTariffZone && toTariffZone
      ? tariffZonesSummary(fromTariffZone, toTariffZone, language, t)
      : undefined;

  const {isError, remoteTokens, fallbackEnabled} = useMobileTokenContextState();
  const warning = getNonInspectableTokenWarning(
    isError,
    fallbackEnabled,
    t,
    remoteTokens,
    isInspectable,
    preassignedFareProduct?.type,
  );

  const secondsUntilValid = ((validTo || 0) - (now || 0)) / 1000;
  const conjunction = t(TicketTexts.validityHeader.durationDelimiter);
  const durationText = secondsToDuration(secondsUntilValid, language, {
    conjunction,
    serialComma: false,
  });
  const timeUntilExpire = t(TicketTexts.validityHeader.valid(durationText));
  return (
    <View style={styles.textsContainer} accessible={true}>
      <ThemeText
        type="body__primary--bold"
        accessibilityLabel={timeUntilExpire}
        testID={testID + 'ExpireTime'}
        style={styles.expireTime}
      >
        {timeUntilExpire}
      </ThemeText>
      {userProfilesWithCount.map((u) => (
        <ThemeText
          type="body__secondary"
          accessibilityLabel={
            userProfileCountAndName(u, omitUserProfileCount, language) +
            screenReaderPause
          }
          testID={testID + 'UserAndCount'}
        >
          {userProfileCountAndName(u, omitUserProfileCount, language)}
        </ThemeText>
      ))}
      {productName && (
        <ThemeText
          type="body__secondary"
          accessibilityLabel={productName + screenReaderPause}
          testID={testID + 'Product'}
        >
          {productName}
        </ThemeText>
      )}
      {tariffZoneSummary && (
        <ThemeText
          type="body__secondary"
          accessibilityLabel={tariffZoneSummary + screenReaderPause}
          testID={testID + 'Zones'}
        >
          {tariffZoneSummary}
        </ThemeText>
      )}
      {warning && <WarningMessage message={warning} />}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flexDirection: 'row'},
  textsContainer: {flex: 1, paddingTop: theme.spacings.xSmall},
  expireTime: {
    marginBottom: theme.spacings.small,
  },
}));

export default CompactTicketInfo;
