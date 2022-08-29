import ThemeText from '@atb/components/text';
import {getReferenceDataName} from '@atb/reference-data/utils';
import {StyleSheet} from '@atb/theme';
import {TicketTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {tariffZonesSummary} from '@atb/screens/Ticketing/Purchase/TariffZones';
import {
  isValidTicket,
  userProfileCountAndName,
} from '@atb/screens/Ticketing/Ticket/utils';
import {screenReaderPause} from '@atb/components/accessible-text';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import ZoneSymbol from '@atb/screens/Ticketing/Ticket/Component/ZoneSymbol';
import {secondsToDuration} from '@atb/utils/date';
import {TicketInfoDetailsProps} from './TicketInfo';
import NonTicketInspectionSymbol from './Component/NotForInspectionSymbol';
import LoadingSymbol from './Component/LoadingSymbol';

export const CompactTicketInfo = (props: TicketInfoDetailsProps) => {
  const styles = useStyles();
  const {status, isInspectable} = props;
  const isValid = isValidTicket(status);
  const {isLoading} = useMobileTokenContextState();
  return (
    <View style={styles.container}>
      <CompactTicketInfoTexts {...props} />
      <View style={styles.symbolContainer}>
        {isLoading && <LoadingSymbol />}
        {isValid && isInspectable && !isLoading && <ZoneSymbol {...props} />}
        {isValid && !isInspectable && !isLoading && (
          <NonTicketInspectionSymbol />
        )}
      </View>
    </View>
  );
};

const CompactTicketInfoTexts = (props: TicketInfoDetailsProps) => {
  const {
    preassignedFareProduct,
    fromTariffZone,
    toTariffZone,
    userProfilesWithCount,
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
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {flexDirection: 'row'},
  textsContainer: {flex: 1, paddingTop: theme.spacings.xSmall},
  expireTime: {
    marginBottom: theme.spacings.small,
  },
  symbolContainer: {
    height: 72,
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
}));

export default CompactTicketInfo;
