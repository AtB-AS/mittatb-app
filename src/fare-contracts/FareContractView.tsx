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
import {UsedAccessValidityHeader} from '@atb/fare-contracts/carnet/UsedAccessValidityHeader';
import {CarnetFooter} from '@atb/fare-contracts/carnet/CarnetFooter';
import {
  isCanBeConsumedNowFareContract,
  isSentOrReceivedFareContract,
  FareContract,
} from '@atb/ticketing';
import {ConsumeCarnetSectionItem} from './components/ConsumeCarnetSectionItem';

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
  const {deviceInspectionStatus} = useMobileTokenContextState();

  const {t} = useTranslation();

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
  } = getFareContractInfo(now, fareContract, currentUserId);

  const isSentOrReceived = isSentOrReceivedFareContract(fareContract);
  const isSent =
    isSentOrReceived && fareContract.customerAccountId !== currentUserId;

  const firstTravelRight = travelRights[0];

  const {benefits} = useOperatorBenefitsForFareProduct(
    firstTravelRight.fareProductRef,
  );

  const shouldShowBundlingInfo =
    benefits && benefits.length > 0 && fareContractValidityStatus === 'valid';

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
    <Section withBottomPadding testID={testID}>
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
          animate={!isStatic}
        />
        <FareContractInfoHeader
          travelRight={firstTravelRight}
          status={validityStatus}
          testID={testID}
          preassignedFareProduct={preassignedFareProduct}
          sentToCustomerAccountId={
            isSent ? fareContract.customerAccountId : undefined
          }
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
      {!isStatic && (
        <LinkSectionItem
          text={t(
            validityStatus === 'valid' &&
              deviceInspectionStatus === 'inspectable'
              ? FareContractTexts.detailsLink.valid
              : FareContractTexts.detailsLink.notValid,
          )}
          onPress={onPressDetails}
          testID={testID + 'Details'}
        />
      )}
      {isCanBeConsumedNowFareContract(fareContract, now) && (
        <ConsumeCarnetSectionItem fareContractId={fareContract.id} />
      )}
    </Section>
  );
};
