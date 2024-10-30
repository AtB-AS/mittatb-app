import React from 'react';
import {
  FareContract,
  isCanBeActivatedNowFareContract,
  isCanBeConsumedNowFareContract,
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
import {StyleSheet, useTheme} from '@atb/theme';
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
import {CarnetFooter} from '../carnet/CarnetFooter';
import {MobilityBenefitsActionSectionItem} from '@atb/mobility/components/MobilityBenefitsActionSectionItem';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {ValidityLine} from '../ValidityLine';
import {ValidityHeader} from '../ValidityHeader';
import {ConsumeCarnetSectionItem} from '../components/ConsumeCarnetSectionItem';
import {ActivateNowSectionItem} from '../components/ActivateNowSectionItem';
import {useFeatureToggles} from '@atb/feature-toggles';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils.ts';
import {UsedAccessesSectionItem} from '@atb/fare-contracts/details/UsedAccessesSectionItem.tsx';

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
  const {theme} = useTheme();
  const styles = useStyles();
  const {findGlobalMessages} = useGlobalMessagesState();
  const {isActivateTicketNowEnabled} = useFeatureToggles();

  const {
    isCarnetFareContract,
    travelRights,
    validityStatus,
    validFrom,
    validTo,
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  } = getFareContractInfo(now, fc, currentUserId);

  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;
  const isReceived = isSentOrReceived && fc.purchasedBy != currentUserId;

  const firstTravelRight = travelRights[0];
  const {tariffZones, userProfiles} = useFirestoreConfiguration();
  const {isInspectable, mobileTokenStatus} = useMobileTokenContextState();
  const {benefits} = useOperatorBenefitsForFareProduct(
    preassignedFareProduct?.id,
  );

  // If the ticket is received, get the sender account ID to look up for phone number.
  const senderAccountId = isReceived ? fc.purchasedBy : undefined;

  const {data: purchaserPhoneNumber} =
    useGetPhoneByAccountIdQuery(senderAccountId);

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
    numberOfTravelRights: fc.travelRights.length,
  };
  const globalMessageCount = findGlobalMessages(
    GlobalMessageContextEnum.appFareContractDetails,
    globalMessageRuleVariables,
  ).length;

  const shouldShowBundlingInfo =
    benefits && benefits.length > 0 && validityStatus === 'valid';

  return (
    <Section style={styles.section}>
      <GenericSectionItem>
        <ValidityHeader
          status={validityStatus}
          now={now}
          createdDate={fc.created.getTime()}
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
          sentToCustomerAccountId={isSent ? fc.customerAccountId : undefined}
        />
      </GenericSectionItem>
      {isInspectable && validityStatus === 'valid' && (
        <GenericSectionItem
          style={
            mobileTokenStatus === 'staticQr'
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
              textColor={theme.color.background.neutral[0]}
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
              FareContractTexts.details.purchasedBy(
                formatPhoneNumber(purchaserPhoneNumber),
              ),
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
      {usedAccesses?.length && (
        <UsedAccessesSectionItem usedAccesses={usedAccesses} />
      )}
      <GenericSectionItem>
        <OrderDetails fareContract={fc} />
      </GenericSectionItem>
      <LinkSectionItem
        text={t(FareContractTexts.details.askForReceipt)}
        onPress={onReceiptNavigate}
        testID="receiptButton"
      />
      {isCanBeConsumedNowFareContract(fc, now, currentUserId) && (
        <ConsumeCarnetSectionItem fareContractId={fc.id} />
      )}
      {isActivateTicketNowEnabled &&
        isCanBeActivatedNowFareContract(fc, now, currentUserId) && (
          <ActivateNowSectionItem fareContractId={fc.id} />
        )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  globalMessages: {
    flex: 1,
    rowGap: theme.spacing.medium,
  },
  section: {
    marginBottom: theme.spacing.large,
  },
  enlargedWhiteBarcodePaddingView: {
    backgroundColor: '#ffffff',
    paddingVertical: theme.spacing.xLarge * 2,
  },
}));
