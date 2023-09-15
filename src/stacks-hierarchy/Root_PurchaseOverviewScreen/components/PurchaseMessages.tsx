import {MessageBox} from '@atb/components/message-box';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {StyleSheet} from '@atb/theme';
import {useTicketingState} from '@atb/ticketing';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {getOtherDeviceIsInspectableWarning} from '../../../fare-contracts/utils';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export type PurchaseWarningsProps = {
  preassignedFareProductType: string;
  requiresTokenOnMobile: boolean;
};

export const PurchaseMessages: React.FC<PurchaseWarningsProps> = ({
  preassignedFareProductType,
  requiresTokenOnMobile,
}) => {
  const {t} = useTranslation();
  const styles = useStyles();

  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
    remoteTokens,
  } = useMobileTokenContextState();
  const tokensEnabled = useHasEnabledMobileToken();
  const {customerProfile} = useTicketingState();
  const hasProfileTravelCard = !!customerProfile?.travelcard;
  const showProfileTravelcardWarning = !tokensEnabled && hasProfileTravelCard;
  const inspectableTokenWarningText = getOtherDeviceIsInspectableWarning(
    tokensEnabled,
    mobileTokenError,
    fallbackEnabled,
    t,
    remoteTokens,
    deviceIsInspectable,
  );
  const {enable_nfk_nightbus_warning} = useRemoteConfig();

  const shouldShowNFKNightBusPeriodNotice =
    preassignedFareProductType === 'period' && enable_nfk_nightbus_warning;

  const shouldShowNFKNightBus24hourNotice =
    preassignedFareProductType === 'hour24' && enable_nfk_nightbus_warning;

  return (
    <>
      {showProfileTravelcardWarning && (
        <MessageBox
          style={styles.warning}
          message={t(PurchaseOverviewTexts.warning)}
          type="warning"
        />
      )}

      {inspectableTokenWarningText && (
        <MessageBox
          type="warning"
          message={inspectableTokenWarningText}
          style={styles.warning}
          isMarkdown={true}
        />
      )}

      {requiresTokenOnMobile && (
        <MessageBox
          type="info"
          message={t(PurchaseOverviewTexts.summary.messageRequiresMobile)}
          style={styles.warning}
          isMarkdown={true}
          subtle={true}
        />
      )}

      {shouldShowNFKNightBusPeriodNotice && ( // TODO: Move to firestore
        <MessageBox
          style={styles.warning}
          message={t(PurchaseOverviewTexts.nfkNightBusPeriodNotice)}
          type="info"
        />
      )}

      {shouldShowNFKNightBus24hourNotice && ( // TODO: Move to firestore
        <MessageBox
          style={styles.warning}
          message={t(PurchaseOverviewTexts.nfkNightBusHour24Notice)}
          type="info"
        />
      )}
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  warning: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
}));
