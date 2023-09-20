import React from 'react';
import {
  FareContract,
  isInspectableTravelRight,
  isPreActivatedTravelRight,
} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {FareContractInfo} from '../FareContractInfo';
import {ValidityHeader} from '../ValidityHeader';
import {ValidityLine} from '../ValidityLine';
import {getValidityStatus} from '@atb/fare-contracts/utils';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {OrderDetails} from '@atb/fare-contracts/details/OrderDetails';
import {UnknownFareContractDetails} from '@atb/fare-contracts/details/UnknownFareContractDetails';
import {PreassignedFareProduct} from '@atb/reference-data/types';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
  useGlobalMessagesState,
} from '@atb/global-messages';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';

type Props = {
  fareContract: FareContract;
  preassignedFareProduct?: PreassignedFareProduct;
  now: number;
  onReceiptNavigate: () => void;
  hasActiveTravelCard?: boolean;
};

export const DetailsContent: React.FC<Props> = ({
  fareContract: fc,
  preassignedFareProduct,
  now,
  onReceiptNavigate,
  hasActiveTravelCard = false,
}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
  } = useMobileTokenContextState();
  const {findGlobalMessages} = useGlobalMessagesState();

  const firstTravelRight = fc.travelRights[0];

  if (isPreActivatedTravelRight(firstTravelRight)) {
    const validFrom = firstTravelRight.startDateTime.toMillis();
    const validTo = firstTravelRight.endDateTime.toMillis();
    const isInspectable = isInspectableTravelRight(
      firstTravelRight,
      hasActiveTravelCard,
      hasEnabledMobileToken,
      deviceIsInspectable,
      mobileTokenError,
      fallbackEnabled,
    );

    const validityStatus = getValidityStatus(now, validFrom, validTo, fc.state);

    const globalMessageRuleVariables = {
      fareProductType: preassignedFareProduct?.type ?? 'unknown',
      firstTravelRightType: firstTravelRight.type,
      validityStatus: validityStatus,
      tariffZones: firstTravelRight.tariffZoneRefs ?? [],
    };
    const globalMessageCount = findGlobalMessages(
      GlobalMessageContextEnum.appFareContractDetails,
      globalMessageRuleVariables,
    ).length;

    return (
      <Section withBottomPadding>
        <GenericSectionItem>
          <ValidityHeader
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
            isInspectable={isInspectable}
            fareProductType={preassignedFareProduct?.type}
          />
          <ValidityLine
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
            isInspectable={isInspectable}
            fareProductType={preassignedFareProduct?.type}
          />
          <FareContractInfo
            travelRights={fc.travelRights.filter(isPreActivatedTravelRight)}
            status={validityStatus}
            isInspectable={isInspectable}
            testID={'details'}
            fareContract={fc}
            fareProductType={preassignedFareProduct?.type}
          />
        </GenericSectionItem>
        {globalMessageCount > 0 && (
          <GenericSectionItem>
            <View style={styles.globalMessages}>
              <GlobalMessage
                globalMessageContext={
                  GlobalMessageContextEnum.appFareContractDetails
                }
                textColor="background_0"
                ruleVariables={globalMessageRuleVariables}
                style={styles.globalMessages}
              />
            </View>
          </GenericSectionItem>
        )}
        <GenericSectionItem>
          <OrderDetails fareContract={fc} />
        </GenericSectionItem>
        <LinkSectionItem
          text={t(FareContractTexts.details.askForReceipt)}
          onPress={onReceiptNavigate}
          accessibility={{accessibilityRole: 'button'}}
          testID="receiptButton"
        />
      </Section>
    );
  } else {
    return <UnknownFareContractDetails fc={fc} />;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  globalMessages: {
    flex: 1,
    rowGap: theme.spacings.medium,
  },
}));
