import {
  CarnetTravelRight,
  CarnetTravelRightUsedAccess,
  FareContract,
  flattenCarnetTravelRightAccesses,
} from '@atb/ticketing';
import {getValidityStatus} from '@atb/fare-contracts/utils';
import {ValidityHeader} from '@atb/fare-contracts/ValidityHeader';
import {UsedAccessValidityHeader} from '@atb/fare-contracts/carnet/UsedAccessValidityHeader';
import {ValidityLine} from '@atb/fare-contracts/ValidityLine';
import {View} from 'react-native';
import {GenericSectionItem, SectionSeparator} from '@atb/components/sections';
import {FareContractInfo} from '@atb/fare-contracts/FareContractInfo';
import {CarnetFooter} from '@atb/fare-contracts/carnet/CarnetFooter';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {UsedAccessStatus} from '@atb/fare-contracts/carnet/types';

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

  return (
    <>
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
          <View style={style.container}>
            <SectionSeparator />
          </View>
        )}
        <FareContractInfo
          travelRights={travelRights}
          status={usedAccessValidityStatus}
          isInspectable={inspectable}
          omitUserProfileCount={true}
          testID={props.testID}
          fareProductType={'carnet'}
        />
      </GenericSectionItem>
      <GenericSectionItem>
        <CarnetFooter
          active={usedAccessValidityStatus === 'valid'}
          maximumNumberOfAccesses={maximumNumberOfAccesses}
          numberOfUsedAccesses={numberOfUsedAccesses}
        />
      </GenericSectionItem>
    </>
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
  container: {
    marginVertical: theme.spacings.medium,
    marginHorizontal: -theme.spacings.medium,
    flexDirection: 'row',
  },
}));
