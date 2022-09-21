import MessageBox from '@atb/components/message-box';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {
  PreassignedFareProduct,
  PreassignedFareProductType,
} from '@atb/reference-data/types';
import {StyleSheet} from '@atb/theme';
import {useTicketState} from '@atb/tickets';
import {PurchaseOverviewTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {getOtherDeviceIsInspectableWarning} from '../../../Ticket/utils';
import {getTrainTicketNoticeText} from '../../../utils';
import {TariffZoneWithMetadata} from '../../TariffZones';

export type PurchaseWarningsProps = {
  preassignedFareProduct: PreassignedFareProduct;
  fromTariffZone: TariffZoneWithMetadata;
  toTariffZone: TariffZoneWithMetadata;
};

const PurchaseMessages: React.FC<PurchaseWarningsProps> = ({
  preassignedFareProduct,
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
  const {customerProfile} = useTicketState();
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

  return (
    <>
      {showProfileTravelcardWarning && (
        <MessageBox
          containerStyle={styles.warning}
          message={t(PurchaseOverviewTexts.warning)}
          type="warning"
        />
      )}

      {inspectableTokenWarningText && (
        <MessageBox
          type="warning"
          message={inspectableTokenWarningText}
          containerStyle={styles.warning}
          isMarkdown={true}
        />
      )}

      {shouldShowValidTrainTicketNotice(
        preassignedFareProduct.type,
        fromTariffZone.id,
        toTariffZone.id,
      ) && (
        <MessageBox
          containerStyle={styles.warning}
          message={getTrainTicketNoticeText(t, preassignedFareProduct.type)}
          type="info"
        />
      )}
    </>
  );
};

const shouldShowValidTrainTicketNotice = (
  PreassignedFareProductType: PreassignedFareProductType,
  fromTariffZoneId: string,
  toTariffZoneId: string,
) =>
  (PreassignedFareProductType === 'single' ||
    PreassignedFareProductType === 'period' ||
    PreassignedFareProductType === 'hour24') &&
  fromTariffZoneId === 'ATB:TariffZone:1' &&
  toTariffZoneId === 'ATB:TariffZone:1';

const useStyles = StyleSheet.createThemeHook((theme) => ({
  warning: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
}));

export default PurchaseMessages;
