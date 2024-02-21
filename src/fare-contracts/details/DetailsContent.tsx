import React from 'react';
import {
  FareContract,
  FareContractState,
  isPreActivatedTravelRight,
  isSentOrReceivedFareContract,
  NormalTravelRight,
} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {
  FareContractInfoHeader,
  FareContractInfoDetails,
} from '../FareContractInfo';
import {
  getFareContractInfo,
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
import {MapFilterType} from '@atb/components/map';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useGetPhoneByAccountIdQuery} from '@atb/on-behalf-of/queries/use-get-phone-by-account-id-query';
import {useAuthState} from '@atb/auth';
import {UsedAccessValidityHeader} from '../carnet/UsedAccessValidityHeader';
import {CarnetFooter} from '../carnet/CarnetFooter';
import {MobilityBenefitsActionSectionItem} from '@atb/mobility/components/MobilityBenefitsActionSectionItem';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {ValidityLine} from '../ValidityLine';
import {ValidityHeader} from '../ValidityHeader';
import {ConsumeCarnetSectionItem} from '../components/ConsumeCarnetButton';

type Props = {
  fareContract: FareContract;
  preassignedFareProduct?: PreassignedFareProduct;
  now: number;
  onReceiptNavigate: () => void;
  onNavigateToMap: (initialFilters: MapFilterType) => void;
  hasActiveTravelCard?: boolean;
  isSentFareContract?: boolean;
};

export const DetailsContent: React.FC<Props> = ({
  fareContract: fc,
  preassignedFareProduct,
  now,
  onReceiptNavigate,
  onNavigateToMap,
}) => {
  const {abtCustomerId: currentUserId} = useAuthState();

  const {t} = useTranslation();
  const styles = useStyles();
  const {findGlobalMessages} = useGlobalMessagesState();

  const {
    isCarnetFareContract,
    travelRights,
    fareContractValidityStatus,
    fareContractValidFrom,
    fareContractValidTo,
    carnetAccessStatus,
    validityStatus,
    validFrom,
    validTo,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  } = getFareContractInfo(now, fc, currentUserId);

  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;
  const isReceived = isSentOrReceived && fc.purchasedBy != currentUserId;

  const firstTravelRight = travelRights[0];
  const {tariffZones, userProfiles} = useFirestoreConfiguration();
  const {deviceInspectionStatus, barcodeStatus} = useMobileTokenContextState();
  const {benefits} = useOperatorBenefitsForFareProduct(
    preassignedFareProduct?.id,
  );

  // If the ticket is received, get the sender account ID to look up for phone number.
  const senderAccountId = isReceived ? fc.purchasedBy : undefined;

  const {data: purchaserPhoneNumber} =
    useGetPhoneByAccountIdQuery(senderAccountId);

  if (isPreActivatedTravelRight(firstTravelRight) || isCarnetFareContract) {
    const firstZone = firstTravelRight.tariffZoneRefs?.[0];
    const lastZone = firstTravelRight.tariffZoneRefs?.slice(-1)?.[0];

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

    const shouldShowBundlingInfo =
      benefits && benefits.length > 0 && validityStatus === 'valid';

    return (
      <Section withBottomPadding>
        <GenericSectionItem>
          {isCarnetFareContract &&
          fareContractValidityStatus === 'valid' &&
          carnetAccessStatus ? (
            <UsedAccessValidityHeader
              now={now}
              status={carnetAccessStatus}
              validFrom={validFrom}
              validTo={validTo}
            />
          ) : (
            <ValidityHeader
              status={fareContractValidityStatus}
              now={now}
              validFrom={fareContractValidFrom}
              validTo={fareContractValidTo}
              fareProductType={preassignedFareProduct?.type}
            />
          )}
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
            sentToCustomerAccountId={isSent ? fc.customerAccountId : undefined}
          />
        </GenericSectionItem>
        {deviceInspectionStatus === 'inspectable' &&
          validityStatus === 'valid' && (
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
        {isCarnetFareContract && (
          <GenericSectionItem>
            <CarnetFooter
              active={validityStatus === 'valid'}
              maximumNumberOfAccesses={maximumNumberOfAccesses!}
              numberOfUsedAccesses={numberOfUsedAccesses!}
            />
          </GenericSectionItem>
        )}
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
        {purchaserPhoneNumber && (
          <GenericSectionItem>
            <MessageInfoText
              type="info"
              message={t(
                FareContractTexts.details.purchasedBy(purchaserPhoneNumber),
              )}
            />
          </GenericSectionItem>
        )}
        {shouldShowBundlingInfo && (
          <MobilityBenefitsActionSectionItem
            benefits={benefits}
            onNavigateToMap={onNavigateToMap}
          />
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
        {isCarnetFareContract &&
          fc.state === FareContractState.NotActivated && (
            <ConsumeCarnetSectionItem fareContractId={fc.id} />
          )}
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
}));
