import React from 'react';
import {
  FareContract,
  isInspectableTravelRight,
  isPreActivatedTravelRight,
  NormalTravelRight,
} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {
  FareContractInfoHeader,
  FareContractInfoDetails,
} from '../FareContractInfo';
import {ValidityHeader} from '../ValidityHeader';
import {ValidityLine} from '../ValidityLine';
import {
  getValidityStatus,
  mapToUserProfilesWithCount,
} from '@atb/fare-contracts/utils';
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
import {useFirestoreConfiguration} from '@atb/configuration';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {Barcode} from './Barcode';

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
  const {tariffZones, userProfiles} = useFirestoreConfiguration();

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

    const {tariffZoneRefs} = firstTravelRight;
    const firstZone = tariffZoneRefs?.[0];
    const lastZone = tariffZoneRefs?.slice(-1)?.[0];

    const fromTariffZone = firstZone
      ? findReferenceDataById(tariffZones, firstZone)
      : undefined;
    const toTariffZone = lastZone
      ? findReferenceDataById(tariffZones, lastZone)
      : undefined;
    const userProfilesWithCount = mapToUserProfilesWithCount(
      fc.travelRights.map((tr) => (tr as NormalTravelRight).userProfileRef),
      userProfiles,
    );

    const globalMessageRuleVariables = {
      fareProductType: preassignedFareProduct?.type ?? 'unknown',
      firstTravelRightType: firstTravelRight.type,
      validityStatus: validityStatus,
      tariffZones: firstTravelRight.tariffZoneRefs ?? [],
      numberOfZones: firstTravelRight.tariffZoneRefs?.length ?? 0,
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
          <FareContractInfoHeader
            travelRight={firstTravelRight}
            status={validityStatus}
            isInspectable={isInspectable}
            testID="details"
            fareProductType={preassignedFareProduct?.type}
          />
        </GenericSectionItem>
        {isInspectable && (
          <GenericSectionItem>
            <Barcode
              validityStatus={validityStatus}
              isInspectable={isInspectable}
              fc={fc}
            />
          </GenericSectionItem>
        )}
        <GenericSectionItem>
          <FareContractInfoDetails
            omitUserProfileCount={true}
            fromTariffZone={fromTariffZone}
            toTariffZone={toTariffZone}
            userProfilesWithCount={userProfilesWithCount}
            status={validityStatus}
            isInspectable={isInspectable}
            preassignedFareProduct={preassignedFareProduct}
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
