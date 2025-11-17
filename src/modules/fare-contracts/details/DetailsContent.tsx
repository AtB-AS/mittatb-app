import React from 'react';
import {
  isCanBeActivatedNowFareContract,
  isCanBeConsumedNowFareContract,
  isSentOrReceivedFareContract,
  useGetFareProductsQuery,
  useRefundOptionsQuery,
} from '@atb/modules/ticketing';
import {FareContractType, getAccesses} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {FareContractInfoDetailsSectionItem} from '../sections/FareContractInfoDetailsSectionItem';
import {
  getFareContractInfo,
  hasShmoBookingId,
  mapToUserProfilesWithCount,
} from '../utils';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {OrderDetailsSectionItem} from '../sections/OrderDetailsSectionItem';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
  useGlobalMessagesContext,
} from '@atb/modules/global-messages';
import {View} from 'react-native';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {PreassignedFareProduct} from '@atb/modules/configuration';
import {Barcode} from './Barcode';
import {MapFilterType} from '@atb/modules/map';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useGetPhoneByAccountIdQuery} from '@atb/modules/on-behalf-of';
import {useAuthContext} from '@atb/modules/auth';
import {CarnetFooter} from '../carnet/CarnetFooter';
import {MobilityBenefitsActionSectionItem} from '@atb/modules/mobility';
import {useOperatorBenefitsForFareProduct} from '@atb/modules/mobility';
import {ConsumeCarnetSectionItem} from '../components/ConsumeCarnetSectionItem';
import {ActivateNowSectionItem} from '../components/ActivateNowSectionItem';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {UsedAccessesSectionItem} from './UsedAccessesSectionItem';
import {ShmoTripDetailsSectionItem} from '@atb/modules/mobility';
import {FareContractHeaderSectionItem} from '../sections/FareContractHeaderSectionItem';
import {FareContractShmoHeaderSectionItem} from '../sections/FareContractShmoHeaderSectionItem';
import {isDefined} from '@atb/utils/presence';
import {RefundSectionItem} from '../components/RefundSectionItem';
import {
  EarnedBonusPointsSectionItem,
  useBonusAmountEarnedQuery,
} from '@atb/modules/bonus';
import {useFareContractLegs} from '@atb/modules/fare-contracts';
import {LegsSummary} from '@atb/components/journey-legs-summary';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {arrayMapUniqueWithCount} from '@atb/utils/array-map-unique-with-count';

type Props = {
  fareContract: FareContractType;
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
  const {abtCustomerId: currentUserId} = useAuthContext();

  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const {findGlobalMessages} = useGlobalMessagesContext();
  const {isActivateTicketNowEnabled} = useFeatureTogglesContext();
  const {data: refundOptions} = useRefundOptionsQuery(fc.orderId, fc.state);

  const {validityStatus, usedAccesses} = getFareContractInfo(
    now,
    fc,
    currentUserId,
  );

  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isReceived = isSentOrReceived && fc.purchasedBy != currentUserId;
  const {data: preassignedFareProducts} = useGetFareProductsQuery();

  const firstTravelRight = fc.travelRights[0];
  const {userProfiles} = useFirestoreConfigurationContext();
  const {isInspectable, mobileTokenStatus} = useMobileTokenContext();
  const {benefits} = useOperatorBenefitsForFareProduct(
    preassignedFareProduct?.id,
  );
  const legs = useFareContractLegs(firstTravelRight.datedServiceJourneys?.[0]);

  // If the ticket is received, get the sender account ID to look up for phone number.
  const senderAccountId = isReceived ? fc.purchasedBy : undefined;

  const {data: purchaserPhoneNumber} =
    useGetPhoneByAccountIdQuery(senderAccountId);

  const userProfilesWithCount = mapToUserProfilesWithCount(
    fc.travelRights.map((tr) => tr.userProfileRef).filter(isDefined),
    userProfiles,
  );

  const baggageProducts = fc.travelRights
    .map((tr) =>
      findReferenceDataById(preassignedFareProducts, tr.fareProductRef),
    )
    .filter(isDefined)
    .filter((p) => p.isBaggageProduct);

  const baggeProductsWithCount = arrayMapUniqueWithCount(
    baggageProducts,
    (a, b) => a.id === b.id,
  );

  const globalMessageRuleVariables = {
    fareProductType: preassignedFareProduct?.type ?? 'unknown',
    validityStatus: validityStatus,
    fareZones: firstTravelRight.fareZoneRefs ?? [],
    numberOfZones: firstTravelRight.fareZoneRefs?.length ?? 0,
    numberOfTravelRights: fc.travelRights.length,
  };
  const globalMessageCount = findGlobalMessages(
    GlobalMessageContextEnum.appFareContractDetails,
    globalMessageRuleVariables,
  ).length;

  const shouldShowBundlingInfo =
    benefits && benefits.length > 0 && validityStatus === 'valid';

  const accesses = getAccesses(fc);

  const shouldShowLegs =
    preassignedFareProduct?.isBookingEnabled && !!legs?.length;

  const {data: bonusAmountEarned} = useBonusAmountEarnedQuery(fc.id);

  return (
    <Section style={styles.section}>
      {hasShmoBookingId(fc) ? (
        <FareContractShmoHeaderSectionItem fareContract={fc} />
      ) : (
        <FareContractHeaderSectionItem fareContract={fc} />
      )}

      {hasShmoBookingId(fc) ? (
        <ShmoTripDetailsSectionItem
          startDateTime={fc.travelRights[0].startDateTime}
          endDateTime={fc.travelRights[0].endDateTime}
          totalAmount={fc.totalAmount}
          withHeader={true}
        />
      ) : (
        <FareContractInfoDetailsSectionItem
          fareContract={fc}
          userProfilesWithCount={userProfilesWithCount}
          baggeProductsWithCount={baggeProductsWithCount}
          status={validityStatus}
          preassignedFareProduct={preassignedFareProduct}
        />
      )}

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
      {accesses && (
        <GenericSectionItem>
          <CarnetFooter validityStatus={validityStatus} fareContract={fc} />
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

      {shouldShowLegs && (
        <GenericSectionItem>
          <LegsSummary compact={false} legs={legs} />
        </GenericSectionItem>
      )}

      {shouldShowBundlingInfo && (
        <MobilityBenefitsActionSectionItem
          benefits={benefits}
          onNavigateToMap={onNavigateToMap}
        />
      )}
      {bonusAmountEarned != undefined && bonusAmountEarned.amount > 0 && (
        <EarnedBonusPointsSectionItem amount={bonusAmountEarned.amount} />
      )}
      {!!usedAccesses?.length && (
        <UsedAccessesSectionItem usedAccesses={usedAccesses} />
      )}

      <OrderDetailsSectionItem fareContract={fc} />

      {fc.orderId && fc.version && (
        <LinkSectionItem
          text={t(FareContractTexts.details.askForReceipt)}
          onPress={onReceiptNavigate}
          testID="receiptButton"
        />
      )}
      {refundOptions?.isRefundable && (
        <RefundSectionItem
          orderId={fc.orderId}
          fareProductType={preassignedFareProduct?.type}
          state={fc.state}
        />
      )}
      {isCanBeConsumedNowFareContract(fc, now, currentUserId) && (
        <ConsumeCarnetSectionItem
          fareContractId={fc.id}
          fareProductType={preassignedFareProduct?.type}
        />
      )}
      {isActivateTicketNowEnabled &&
        isCanBeActivatedNowFareContract(
          fc,
          now,
          currentUserId,
          preassignedFareProduct?.isBookingEnabled,
        ) && (
          <ActivateNowSectionItem
            fareContractId={fc.id}
            fareProductType={preassignedFareProduct?.type}
          />
        )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom: bottomSafeAreaInset} = useSafeAreaInsets();
  return {
    globalMessages: {
      flex: 1,
      rowGap: theme.spacing.medium,
    },
    section: {
      marginBottom: bottomSafeAreaInset,
    },
    fareContractDetails: {
      flex: 1,
      paddingBottom: theme.spacing.large,
      rowGap: theme.spacing.medium,
    },
    enlargedWhiteBarcodePaddingView: {
      backgroundColor: '#ffffff',
      paddingVertical: theme.spacing.xLarge * 2,
    },
  };
});
