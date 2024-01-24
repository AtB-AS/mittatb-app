import React from 'react';
import {
  FareContract,
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
import {useMobileTokenContextState} from '@atb/mobile-token';
import {OrderDetails} from '@atb/fare-contracts/details/OrderDetails';
import {UnknownFareContractDetails} from '@atb/fare-contracts/details/UnknownFareContractDetails';
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
import {
  findReferenceDataById,
  PreassignedFareProduct,
} from '@atb/configuration';
import {Barcode} from './Barcode';
import {BenefitTiles} from '@atb/mobility/components/BenefitTile';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {ThemeText} from '@atb/components/text';

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
}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {findGlobalMessages} = useGlobalMessagesState();

  const firstTravelRight = fc.travelRights[0];
  const {tariffZones, userProfiles} = useFirestoreConfiguration();
  const {deviceInspectionStatus, barcodeStatus} = useMobileTokenContextState();
  const {benefits} = useOperatorBenefitsForFareProduct(
    preassignedFareProduct?.id,
  );

  if (isPreActivatedTravelRight(firstTravelRight)) {
    const validFrom = firstTravelRight.startDateTime.toMillis();
    const validTo = firstTravelRight.endDateTime.toMillis();

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
            fareProductType={preassignedFareProduct?.type}
          />
          <ValidityLine
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
            fareProductType={preassignedFareProduct?.type}
          />
          <FareContractInfoHeader
            travelRight={firstTravelRight}
            status={validityStatus}
            testID="details"
            preassignedFareProduct={preassignedFareProduct}
          />
        </GenericSectionItem>
        {deviceInspectionStatus === 'inspectable' && (
          <GenericSectionItem
            style={
              barcodeStatus === 'staticQr'
                ? styles.enlargedWhiteBarcodePaddingView
                : undefined
            }
          >
            <Barcode validityStatus={validityStatus} fc={fc} />
          </GenericSectionItem>
        )}
        <GenericSectionItem>
          <FareContractInfoDetails
            fromTariffZone={fromTariffZone}
            toTariffZone={toTariffZone}
            userProfilesWithCount={userProfilesWithCount}
            status={validityStatus}
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
        {benefits && (
          <GenericSectionItem style={styles.benefitSection}>
            <ThemeText type="body__secondary" color="secondary">
              {t(FareContractTexts.label.indludedBenefits)}
            </ThemeText>
            <BenefitTiles
              benefits={benefits}
              interactiveColor="interactive_2"
            />
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
  enlargedWhiteBarcodePaddingView: {
    backgroundColor: '#ffffff',
    paddingVertical: theme.spacings.xLarge * 2,
  },
  benefitSection: {
    rowGap: theme.spacings.small,
  },
}));
