import {
  CarnetTravelRight,
  CarnetTravelRightUsedAccess,
  FareContract,
  flattenCarnetTravelRightAccesses,
} from '@atb/ticketing';
import {
  getValidityStatus,
  mapToUserProfilesWithCount,
} from '@atb/fare-contracts/utils';
import {ValidityHeader} from '@atb/fare-contracts/ValidityHeader';
import {UsedAccessValidityHeader} from '@atb/fare-contracts/carnet/UsedAccessValidityHeader';
import {ValidityLine} from '@atb/fare-contracts/ValidityLine';
import {View} from 'react-native';
import {GenericSectionItem, SectionSeparator} from '@atb/components/sections';
import {
  FareContractInfoHeader,
  FareContractInfoDetails,
} from '@atb/fare-contracts/FareContractInfo';
import {CarnetFooter} from '@atb/fare-contracts/carnet/CarnetFooter';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {UsedAccessStatus} from '@atb/fare-contracts/carnet/types';
import {findReferenceDataById} from '@atb/reference-data/utils';
import {useFirestoreConfiguration} from '@atb/configuration';

export function CarnetDetails(props: {
  now: number;
  inspectable: boolean;
  travelRights: CarnetTravelRight[];
  testID?: string;
  fareContract: FareContract;
}) {
  const fareContractValidFrom = props.travelRights[0].startDateTime.toMillis();
  const fareContractValidTo = props.travelRights[0].endDateTime.toMillis();
  const {now, inspectable, travelRights, fareContract} = props;
  const {usedAccesses, maximumNumberOfAccesses, numberOfUsedAccesses} =
    flattenCarnetTravelRightAccesses(travelRights);
  const {tariffZones, userProfiles, preassignedFareProducts} =
    useFirestoreConfiguration();
  const {
    status: usedAccessValidityStatus,
    validFrom: usedAccessValidFrom,
    validTo: usedAccessValidTo,
  } = getLastUsedAccess(now, usedAccesses);
  const style = useStyles();
  const fareContractValidityStatus = getValidityStatus(
    now,
    fareContractValidFrom,
    fareContractValidTo,
    fareContract.state,
  );
  const firstTravelRight = travelRights[0];
  const {tariffZoneRefs} = firstTravelRight;
  const firstZone = tariffZoneRefs?.[0];
  const lastZone = tariffZoneRefs?.slice(-1)?.[0];

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
    <GenericSectionItem radius="top">
      {fareContractValidityStatus !== 'valid' ? (
        <ValidityHeader
          now={now}
          status={fareContractValidityStatus}
          validFrom={fareContractValidFrom}
          validTo={fareContractValidTo}
          isInspectable={inspectable}
          fareProductType={'carnet'}
        />
      ) : (
        <UsedAccessValidityHeader
          now={now}
          status={usedAccessValidityStatus}
          validFrom={usedAccessValidFrom}
          validTo={usedAccessValidTo}
          isInspectable={inspectable}
        />
      )}
      {usedAccessValidTo && usedAccessValidFrom ? (
        <ValidityLine
          status={usedAccessValidityStatus}
          now={props.now}
          validFrom={usedAccessValidFrom}
          validTo={usedAccessValidTo}
          isInspectable={false}
          fareProductType={'carnet'}
        />
      ) : (
        <View style={style.sectionSeparator}>
          <SectionSeparator />
        </View>
      )}
      <FareContractInfoHeader
        travelRight={firstTravelRight}
        status={usedAccessValidityStatus}
        isInspectable={inspectable}
        testID={props.testID}
        fareProductType={'carnet'}
      />
      <View style={style.sectionSeparator}>
        <SectionSeparator />
      </View>
      <FareContractInfoDetails
        omitUserProfileCount={true}
        fromTariffZone={fromTariffZone}
        toTariffZone={toTariffZone}
        userProfilesWithCount={userProfilesWithCount}
        status={usedAccessValidityStatus}
        isInspectable={inspectable}
        preassignedFareProduct={preassignedFareProduct}
      />
      <View style={style.sectionSeparator}>
        <SectionSeparator />
      </View>
      <CarnetFooter
        active={usedAccessValidityStatus === 'valid'}
        maximumNumberOfAccesses={maximumNumberOfAccesses}
        numberOfUsedAccesses={numberOfUsedAccesses}
      />
    </GenericSectionItem>
  );
}

type LastUsedAccessState = {
  status: UsedAccessStatus;
  validFrom: number | undefined;
  validTo: number | undefined;
};

function getUsedAccessValidity(
  now: number,
  validFrom: number,
  validTo: number,
): UsedAccessStatus {
  if (now > validTo) return 'inactive';
  if (now < validFrom) return 'upcoming';
  return 'valid';
}

export function getLastUsedAccess(
  now: number,
  usedAccesses: CarnetTravelRightUsedAccess[],
): LastUsedAccessState {
  const lastUsedAccess = usedAccesses.slice(-1).pop();

  let status: UsedAccessStatus = 'inactive';
  let validFrom: number | undefined = undefined;
  let validTo: number | undefined = undefined;

  if (lastUsedAccess) {
    validFrom = lastUsedAccess.startDateTime.toMillis();
    validTo = lastUsedAccess.endDateTime.toMillis();
    status = getUsedAccessValidity(now, validFrom, validTo);
  }

  return {status, validFrom, validTo};
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  sectionSeparator: {
    marginVertical: theme.spacings.medium,
    marginHorizontal: -theme.spacings.medium,
    flexDirection: 'row',
  },
}));
