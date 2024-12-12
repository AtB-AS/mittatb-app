import {
  findReferenceDataById,
  useFirestoreConfiguration,
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
import {useAuthState} from '@atb/auth';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {CarnetFooter} from '@atb/fare-contracts/carnet/CarnetFooter';
import {
  isCanBeConsumedNowFareContract,
  isSentOrReceivedFareContract,
  FareContract,
  isCanBeActivatedNowFareContract,
} from '@atb/ticketing';
import {ConsumeCarnetSectionItem} from './components/ConsumeCarnetSectionItem';
import {StyleSheet, useTheme} from '@atb/theme';
import {ActivateNowSectionItem} from './components/ActivateNowSectionItem';
import {useFeatureToggles} from '@atb/feature-toggles';
import {FareContractFromTo} from '@atb/fare-contracts/components/FareContractFromTo';
import {FareContractDetail} from '@atb/fare-contracts/components/FareContractDetail';
import React from 'react';
import {InspectionSymbol} from '@atb/fare-contracts/components/InspectionSymbol';
import {View} from 'react-native';

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
  const {abtCustomerId: currentUserId} = useAuthState();
  const {isInspectable} = useMobileTokenContextState();
  const {isActivateTicketNowEnabled} = useFeatureToggles();

  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();

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

  const {userProfiles, preassignedFareProducts} = useFirestoreConfiguration();

  const userProfilesWithCount = mapToUserProfilesWithCount(
    travelRights.map((tr) => tr.userProfileRef),
    userProfiles,
  );

  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    firstTravelRight.fareProductRef,
  );

  return (
    <Section style={styles.section} testID={testID}>
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
      <GenericSectionItem style={styles.detailContainer}>
        <View style={styles.detailTextContainer}>
          <FareContractFromTo
            fc={fareContract}
            backgroundColor={theme.color.background.neutral['0']}
            mode="small"
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
  detailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailTextContainer: {
    rowGap: theme.spacing.medium,
  },
}));
