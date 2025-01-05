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
import {ValidityHeader} from '@atb/fare-contracts/ValidityHeader';
import {ValidityLine} from '@atb/fare-contracts/ValidityLine';
import {FareContractInfoHeader} from '@atb/fare-contracts/FareContractInfo';
import {MobilityBenefitsInfoSectionItem} from '@atb/mobility/components/MobilityBenefitsInfoSectionItem';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useAuthContext} from '@atb/auth';
import {useMobileTokenContext} from '@atb/mobile-token';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {CarnetFooter} from '@atb/fare-contracts/carnet/CarnetFooter';
import {
  isCanBeConsumedNowFareContract,
  isSentOrReceivedFareContract,
  FareContract,
  isCanBeActivatedNowFareContract,
} from '@atb/ticketing';
import {ConsumeCarnetSectionItem} from './components/ConsumeCarnetSectionItem';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {ActivateNowSectionItem} from './components/ActivateNowSectionItem';
import {useFeatureTogglesContext} from '@atb/feature-toggles';
import React from 'react';
import {InspectionSymbol} from '@atb/fare-contracts/components/InspectionSymbol';
import {FareContractFromTo} from '@atb/fare-contracts/components/FareContractFromTo';
import {View} from 'react-native';
import {FareContractDetail} from '@atb/fare-contracts/components/FareContractDetail';

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
    validFrom,
    validTo,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  } = getFareContractInfo(now, fareContract, currentUserId);

  const isSentOrReceived = isSentOrReceivedFareContract(fareContract);
  const isSent =
    isSentOrReceived && fareContract.customerAccountId !== currentUserId;

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

  return (
    <Section testID={testID}>
      <GenericSectionItem>
        <ValidityHeader
          status={validityStatus}
          now={now}
          createdDate={fareContract.created.getTime()}
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
          animate={!isStatic}
        />
        <FareContractInfoHeader
          status={validityStatus}
          testID={testID}
          preassignedFareProduct={preassignedFareProduct}
          sentToCustomerAccountId={
            isSent ? fareContract.customerAccountId : undefined
          }
        />
      </GenericSectionItem>
      <GenericSectionItem>
        <View style={styles.detailContainer}>
          <View style={styles.detailTextContainer}>
            <FareContractFromTo
              backgroundColor={theme.color.background.neutral[0]}
              mode="small"
              fc={fareContract}
            />
            <FareContractDetail
              content={userProfilesWithCount.map((u) =>
                userProfileCountAndName(u, language),
              )}
            />
          </View>
          <InspectionSymbol
            preassignedFareProduct={preassignedFareProduct}
            sentTicket={validityStatus === 'sent'}
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
  detailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailTextContainer: {
    flex: 1,
    rowGap: theme.spacing.medium,
  },
}));
