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
import {getValidOnTrainNoticeText} from '../../Root_TabNavigatorStack/TabNav_TicketingStack/utils';
import {TariffZoneWithMetadata} from '../../Root_PurchaseTariffZonesSearchByMapScreen';

export type PurchaseWarningsProps = {
  preassignedFareProductType: string;
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
};

const PurchaseMessages: React.FC<PurchaseWarningsProps> = ({
  preassignedFareProductType,
  fromTariffZone,
  toTariffZone,
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

  const shouldShowValidTrainTicketNotice =
    (preassignedFareProductType === 'single' ||
      preassignedFareProductType === 'period' ||
      preassignedFareProductType === 'hour24') &&
    fromTariffZone.id === 'ATB:TariffZone:1' &&
    toTariffZone.id === 'ATB:TariffZone:1';

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

      {shouldShowValidTrainTicketNotice && (
        <MessageBox
          style={styles.warning}
          message={getValidOnTrainNoticeText(t, preassignedFareProductType)}
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

export default PurchaseMessages;
