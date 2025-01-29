import React from 'react';
import {
  FareContract,
  hasTravelRightAccesses,
  isCanBeActivatedNowFareContract,
  isCanBeConsumedNowFareContract,
  isSentOrReceivedFareContract,
} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {FareContractInfoDetails} from '../FareContractInfoDetails';
import {
  getFareContractInfo,
  mapToUserProfilesWithCount,
} from '@atb/fare-contracts/utils';
import {useMobileTokenContext} from '@atb/mobile-token';
import {OrderDetails} from '@atb/fare-contracts/details/OrderDetails';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {
  GlobalMessage,
  GlobalMessageContextEnum,
  useGlobalMessagesContext,
} from '@atb/global-messages';
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
import {useFeatureTogglesContext} from '@atb/feature-toggles';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {UsedAccessesSectionItem} from '@atb/fare-contracts/details/UsedAccessesSectionItem';
import {FareContractFromTo} from '@atb/fare-contracts/modules/FareContractFromTo';
import {Description} from '@atb/fare-contracts/components/FareContractDescription';
import {ValidTo} from '@atb/fare-contracts/components/ValidTo';
import {useFetchOnBehalfOfAccountsQuery} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {WithValidityLine} from '@atb/fare-contracts/components/WithValidityLine';
import {ProductName} from '@atb/fare-contracts/components/ProductName';
import {ValidityTime} from '@atb/fare-contracts/components/ValidityTime';

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
  const isSent = isSentOrReceived && fc.customerAccountId !== currentUserId;
  const isReceived = isSentOrReceived && fc.purchasedBy != currentUserId;
  const {data: phoneNumber} = useGetPhoneByAccountIdQuery(fc.customerAccountId);
  const {data: onBehalfOfAccounts} = useFetchOnBehalfOfAccountsQuery({
    enabled: !!phoneNumber,
  });
  const recipientName =
    phoneNumber &&
    onBehalfOfAccounts?.find((a) => a.phoneNumber === phoneNumber)?.name;

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
    fc.travelRights.map((tr) => tr.userProfileRef),
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
      <GenericSectionItem
        style={{
          paddingVertical: 0,
        }}
      >
        <WithValidityLine fc={fc}>
          <ProductName fc={fc} />
          <ValidityTime fc={fc} />
          <ValidTo fc={fc} />
          <Description fc={fc} />
        </WithValidityLine>
        <View style={styles.fareContractDetails}>
          {isSent && !!phoneNumber && (
            <MessageInfoBox
              type="warning"
              message={t(
                FareContractTexts.details.sentTo(
                  recipientName || formatPhoneNumber(phoneNumber),
                ),
              )}
            />
          )}
          <FareContractFromTo
            backgroundColor={theme.color.background.neutral['0']}
            mode="large"
            fc={fc}
            preassignedFareProduct={preassignedFareProduct}
          />
        </View>
      </GenericSectionItem>
      <GenericSectionItem type="spacious">
        <FareContractInfoDetails
          userProfilesWithCount={userProfilesWithCount}
          status={validityStatus}
          preassignedFareProduct={preassignedFareProduct}
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
