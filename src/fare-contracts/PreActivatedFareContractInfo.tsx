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
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';

type Props = {
  fareContractState: FareContractState;
  travelRights: PreActivatedTravelRight[];
  now: number;
  isInspectable: boolean;
  hideDetails?: boolean;
  onPressDetails?: () => void;
  testID?: string;
};

export const PreActivatedFareContractInfo: React.FC<Props> = ({
  fareContractState,
  travelRights,
  now,
  isInspectable,
  hideDetails,
  onPressDetails,
  testID,
}) => {
  const {t} = useTranslation();
  const {tariffZones, userProfiles, preassignedFareProducts} =
    useFirestoreConfiguration();

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
          isInspectable={isInspectable}
          now={now}
          validFrom={validFrom}
          validTo={validTo}
          fareProductType={preassignedFareProduct?.type}
        />
        <ValidityLine
          status={validityStatus}
          isInspectable={isInspectable}
          now={now}
          validFrom={validFrom}
          validTo={validTo}
          fareProductType={preassignedFareProduct?.type}
        />
        <FareContractInfoHeader
          travelRight={firstTravelRight}
          status={validityStatus}
          isInspectable={isInspectable}
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
          isInspectable={isInspectable}
          preassignedFareProduct={preassignedFareProduct}
        />
      </GenericSectionItem>
      {!hideDetails && (
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
    </Section>
  );
};
