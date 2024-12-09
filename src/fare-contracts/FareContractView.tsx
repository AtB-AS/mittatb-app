import {
  findReferenceDataById,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {
  getFareContractInfo,
  mapToUserProfilesWithCount,
} from '@atb/fare-contracts/utils';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {ValidityHeader} from '@atb/fare-contracts/ValidityHeader';
import {ValidityLine} from '@atb/fare-contracts/ValidityLine';
import {
  FareContractInfoDetails,
  FareContractInfoHeader,
} from '@atb/fare-contracts/FareContractInfo';
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

  const {t} = useTranslation();
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

  const {tariffZones, userProfiles, preassignedFareProducts} =
    useFirestoreConfiguration();

  const firstZone = firstTravelRight.tariffZoneRefs?.[0];
  const lastZone = firstTravelRight.tariffZoneRefs?.slice(-1)?.[0];
  const fromTariffZone = firstZone
    ? findReferenceDataById(tariffZones, firstZone)
    : undefined;
  const toTariffZone = lastZone
    ? findReferenceDataById(tariffZones, lastZone)
    : undefined;

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
        <FareContractFromTo
          backgroundColor={theme.color.background.neutral['0']}
          mode="large"
          fc={fareContract}
        />
      </GenericSectionItem>
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
}));
