import {FareContractState, PreActivatedTravelRight} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {
  FareContractInfoHeader,
  FareContractInfoDetails,
} from './FareContractInfo';
import {ValidityHeader} from './ValidityHeader';
import {ValidityLine} from './ValidityLine';
import {
  getValidityStatus,
  mapToUserProfilesWithCount,
} from '@atb/fare-contracts/utils';
import {
  useFirestoreConfiguration,
  findReferenceDataById,
} from '@atb/configuration';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {MobilityBenefitsInfoSectionItem} from '@atb/mobility/components/MobilityBenefitsInfoSectionItem';

type Props = {
  fareContractState: FareContractState;
  travelRights: PreActivatedTravelRight[];
  now: number;
  hideDetails?: boolean;
  onPressDetails?: () => void;
  testID?: string;
};

export const PreActivatedFareContractInfo: React.FC<Props> = ({
  fareContractState,
  travelRights,
  now,
  hideDetails,
  onPressDetails,
  testID,
}) => {
  const {t} = useTranslation();
  const {tariffZones, userProfiles, preassignedFareProducts} =
    useFirestoreConfiguration();
  const {deviceInspectionStatus} = useMobileTokenContextState();

  const firstTravelRight = travelRights[0];
  const {startDateTime, endDateTime, tariffZoneRefs, fareProductRef} =
    firstTravelRight;

  const validTo = endDateTime.toMillis();
  const validFrom = startDateTime.toMillis();
  const validityStatus = getValidityStatus(
    now,
    validFrom,
    validTo,
    fareContractState,
  );

  const firstZone = tariffZoneRefs?.[0];
  const lastZone = tariffZoneRefs?.slice(-1)?.[0];
  const fromTariffZone = firstZone
    ? findReferenceDataById(tariffZones, firstZone)
    : undefined;
  const toTariffZone = lastZone
    ? findReferenceDataById(tariffZones, lastZone)
    : undefined;

  const preassignedFareProduct = findReferenceDataById(
    preassignedFareProducts,
    fareProductRef,
  );

  const userProfilesWithCount = mapToUserProfilesWithCount(
    travelRights.map((tr) => tr.userProfileRef),
    userProfiles,
  );

  return (
    <Section withBottomPadding testID={testID}>
      <GenericSectionItem>
        <ValidityHeader
          status={validityStatus}
          now={now}
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
          testID={testID}
          preassignedFareProduct={preassignedFareProduct}
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
      <MobilityBenefitsInfoSectionItem
        fareProductId={preassignedFareProduct?.id}
      />
      {!hideDetails && (
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
    </Section>
  );
};
