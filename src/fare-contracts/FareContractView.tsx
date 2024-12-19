import {
  findReferenceDataById,
  useFirestoreConfigurationContext,
} from '@atb/configuration';
import {
  getFareContractInfo,
  mapToUserProfilesWithCount,
  userProfileCountAndName,
} from '@atb/fare-contracts/utils';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {MobilityBenefitsInfoSectionItem} from '@atb/mobility/components/MobilityBenefitsInfoSectionItem';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useAuthContext} from '@atb/auth';
import {useMobileTokenContext} from '@atb/mobile-token';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {CarnetFooter} from '@atb/fare-contracts/carnet/CarnetFooter';
import {
  isCanBeConsumedNowFareContract,
  FareContract,
  isCanBeActivatedNowFareContract,
  isSentOrReceivedFareContract,
} from '@atb/ticketing';
import {ConsumeCarnetSectionItem} from './components/ConsumeCarnetSectionItem';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ActivateNowSectionItem} from './components/ActivateNowSectionItem';
import {useFeatureTogglesContext} from '@atb/feature-toggles';
import {FareContractFromTo} from '@atb/fare-contracts/components/FareContractFromTo';
import {InspectionSymbol} from '@atb/fare-contracts/components/InspectionSymbol';
import {View} from 'react-native';
import {getTransportModeText} from '@atb/components/transportation-modes';
import {ProductName} from '@atb/fare-contracts/components/ProductName';
import {Description} from '@atb/fare-contracts/components/FareContractDescription';
import {useGetPhoneByAccountIdQuery} from '@atb/on-behalf-of/queries/use-get-phone-by-account-id-query';
import {useFetchOnBehalfOfAccountsQuery} from '@atb/on-behalf-of/queries/use-fetch-on-behalf-of-accounts-query';
import {WithValidityLine} from '@atb/fare-contracts/components/WithValidityLine';
import {ValidityHeader} from '@atb/fare-contracts/ValidityHeader';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {formatPhoneNumber} from '@atb/utils/phone-number-utils';
import {FareContractDetailItem} from '@atb/fare-contracts/components/FareContractDetailItem';

type Props = {
  now: number;
  fareContract: FareContract;
  isStatic?: boolean;
  onPressDetails?: () => void;
  testID?: string;
};

export const FareContractView: React.FC<Props> = ({
  now,
  fareContract,
  isStatic,
  onPressDetails,
  testID,
}) => {
  const {abtCustomerId: currentUserId} = useAuthContext();
  const {isInspectable} = useMobileTokenContext();
  const {isActivateTicketNowEnabled} = useFeatureTogglesContext();

  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();

  const {
    isCarnetFareContract,
    travelRights,
    validityStatus,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  } = getFareContractInfo(now, fareContract, currentUserId);

  const isSentOrReceived = isSentOrReceivedFareContract(fareContract);
  const isSent =
    isSentOrReceived && fareContract.customerAccountId !== currentUserId;
  const {data: phoneNumber} = useGetPhoneByAccountIdQuery(
    fareContract.customerAccountId,
  );
  const {data: onBehalfOfAccounts} = useFetchOnBehalfOfAccountsQuery({
    enabled: !!phoneNumber,
  });
  const recipientName =
    phoneNumber &&
    onBehalfOfAccounts?.find((a) => a.phoneNumber === phoneNumber)?.name;

  const firstTravelRight = travelRights[0];

  const {benefits} = useOperatorBenefitsForFareProduct(
    firstTravelRight.fareProductRef,
  );

  const shouldShowBundlingInfo =
    benefits && benefits.length > 0 && validityStatus === 'valid';

  const {userProfiles, preassignedFareProducts} =
    useFirestoreConfigurationContext();

  const userProfilesWithCount = mapToUserProfilesWithCount(
    travelRights.map((tr) => tr.userProfileRef),
    userProfiles,
  );

  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );

  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );

  return (
    <Section testID={testID}>
      <GenericSectionItem
        style={{
          paddingVertical: 0,
        }}
      >
        <WithValidityLine
          fc={fareContract}
          preassignedFareProduct={preassignedFareProduct}
        >
          <ProductName fc={fareContract} />
          <ValidityHeader fc={fareContract} />
          <Description fc={fareContract} />
        </WithValidityLine>
      </GenericSectionItem>
      <GenericSectionItem style={styles.fareContractDetails}>
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
        <View style={styles.detailRow}>
          <View style={styles.fareContractDetailItems}>
            <FareContractFromTo
              fc={fareContract}
              backgroundColor={theme.color.background.neutral[0]}
              mode="small"
            />
            {!!fareProductTypeConfig?.transportModes && (
              <FareContractDetailItem
                content={[
                  getTransportModeText(fareProductTypeConfig.transportModes, t),
                ]}
              />
            )}

            <FareContractDetailItem
              content={userProfilesWithCount.map((u) =>
                userProfileCountAndName(u, language),
              )}
            />
          </View>
          <InspectionSymbol
            preassignedFareProduct={preassignedFareProduct}
            sentTicket={validityStatus === 'sent'}
            /* TODO: This has the wrong border color for invalid fare contracts */
          />
        </View>
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
      {shouldShowBundlingInfo && (
        <MobilityBenefitsInfoSectionItem benefits={benefits} />
      )}
      {isActivateTicketNowEnabled &&
        isCanBeActivatedNowFareContract(fareContract, now, currentUserId) && (
          <ActivateNowSectionItem fareContractId={fareContract.id} />
        )}
      {!isStatic && (
        <LinkSectionItem
          text={t(
            validityStatus === 'valid' && isInspectable
              ? FareContractTexts.detailsLink.valid
              : FareContractTexts.detailsLink.notValid,
          )}
          onPress={onPressDetails}
          testID={testID + 'Details'}
        />
      )}
      {isCanBeConsumedNowFareContract(fareContract, now, currentUserId) && (
        <ConsumeCarnetSectionItem fareContractId={fareContract.id} />
      )}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    marginBottom: theme.spacing.large,
  },
  fareContractDetails: {
    paddingVertical: theme.spacing.large,
    rowGap: theme.spacing.large,
  },
  detailRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: theme.spacing.small,
  },
  fareContractDetailItems: {
    rowGap: theme.spacing.xSmall,
  },
}));
