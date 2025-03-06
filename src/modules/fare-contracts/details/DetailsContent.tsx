import React from 'react';
import {
  hasTravelRightAccesses,
  isCanBeActivatedNowFareContract,
  isCanBeConsumedNowFareContract,
  isSentOrReceivedFareContract,
} from '@atb/ticketing';
import {FareContractType} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {FareContractInfoDetailsSectionItem} from '../sections/FareContractInfoDetailsSectionItem';
import {
  getFareContractInfo,
  hasShmoBookingId,
  mapToUserProfilesWithCount,
} from '../utils';
import {useMobileTokenContext} from '@atb/mobile-token';
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
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {PreassignedFareProduct} from '@atb/configuration';
import {Barcode} from './Barcode';
import {MapFilterType} from '@atb/components/map';
import {MessageInfoText} from '@atb/components/message-info-text';
import {useGetPhoneByAccountIdQuery} from '@atb/on-behalf-of/queries/use-get-phone-by-account-id-query';
import {useAuthContext} from '@atb/auth';
import {CarnetFooter} from '../carnet/CarnetFooter';
import {MobilityBenefitsActionSectionItem} from '@atb/mobility/components/MobilityBenefitsActionSectionItem';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {ConsumeCarnetSectionItem} from '../components/ConsumeCarnetSectionItem';
import {ActivateNowSectionItem} from '../components/ActivateNowSectionItem';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {UsedAccessesSectionItem} from './UsedAccessesSectionItem';
import {ShmoTripDetailsSectionItem} from '@atb/mobility/components/ShmoTripDetailsSectionItem';
import {FareContractHeaderSectionItem} from '../sections/FareContractHeaderSectionItem';
import {FareContractShmoHeaderSectionItem} from '../sections/FareContractShmoHeaderSectionItem';
import {isDefined} from '@atb/utils/presence';

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

  const {
    travelRights,
    validityStatus,
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  } = getFareContractInfo(now, fc, currentUserId);

  const isSentOrReceived = isSentOrReceivedFareContract(fc);
  const isReceived = isSentOrReceived && fc.purchasedBy != currentUserId;

  const firstTravelRight = travelRights[0];
  const {userProfiles} = useFirestoreConfigurationContext();
  const {isInspectable, mobileTokenStatus} = useMobileTokenContext();
  const {benefits} = useOperatorBenefitsForFareProduct(
    preassignedFareProduct?.id,
  );

  // If the ticket is received, get the sender account ID to look up for phone number.
  const senderAccountId = isReceived ? fc.purchasedBy : undefined;

  const {data: purchaserPhoneNumber} =
    useGetPhoneByAccountIdQuery(senderAccountId);

  const userProfilesWithCount = mapToUserProfilesWithCount(
    fc.travelRights.map((tr) => tr.userProfileRef).filter(isDefined),
    userProfiles,
  );

  const globalMessageRuleVariables = {
    fareProductType: preassignedFareProduct?.type ?? 'unknown',
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
      {hasTravelRightAccesses(fc.travelRights) && (
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
      {!!usedAccesses?.length && (
        <UsedAccessesSectionItem usedAccesses={usedAccesses} />
      )}

      <OrderDetailsSectionItem fareContract={fc} />

      <LinkSectionItem
        text={t(FareContractTexts.details.askForReceipt)}
        onPress={onReceiptNavigate}
        testID="receiptButton"
      />
      {isCanBeConsumedNowFareContract(fc, now, currentUserId) && (
        <ConsumeCarnetSectionItem
          fareContractId={fc.id}
          fareProductType={preassignedFareProduct?.type}
        />
      )}
      {isActivateTicketNowEnabled &&
        isCanBeActivatedNowFareContract(fc, now, currentUserId) && (
          <ActivateNowSectionItem
            fareContractId={fc.id}
            fareProductType={preassignedFareProduct?.type}
          />
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
  fareContractDetails: {
    flex: 1,
    paddingBottom: theme.spacing.large,
    rowGap: theme.spacing.medium,
  },
  enlargedWhiteBarcodePaddingView: {
    backgroundColor: '#ffffff',
    paddingVertical: theme.spacing.xLarge * 2,
  },
}));
