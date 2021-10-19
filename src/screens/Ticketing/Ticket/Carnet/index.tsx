import * as Sections from '@atb/components/sections';
import {
  CarnetTicket,
  CarnetTicketUsedAccess,
  FareContractState,
  flattenCarnetTicketAccesses,
} from '@atb/tickets';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import ValidityLine from '../ValidityLine';
import {getRelativeValidity, getValidityStatus} from '../utils';
import {useTheme} from '@atb/theme';
import TicketInfo from '../TicketInfo';
import UsedAccessValidityHeader from './UsedAccessValidityHeader';
import {UsedAccessStatus} from './types';
import ValidityHeader from '../ValidityHeader';
import ThemeText from '@atb/components/text';
import CarnetFooter from './CarnetFooter';

type Props = {
  fareContractState: FareContractState;
  travelRights: CarnetTicket[];
  now: number;
  isInspectable: boolean;
};

const CarnetTicketInfo: React.FC<Props> = ({
  fareContractState,
  travelRights,
  now,
  isInspectable,
}) => {
  const {
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  } = flattenCarnetTicketAccesses(travelRights);

  const {
    status: usedAccessValidityStatus,
    validFrom: usedAccessValidFrom,
    validTo: usedAccessValidTo,
  } = useLastUsedAccess(now, usedAccesses);

  const fareContractValidFrom = travelRights[0].startDateTime.toMillis();
  const fareContractValidTo = travelRights[0].endDateTime.toMillis();

  const fareContractValidityStatus = getValidityStatus(
    now,
    fareContractValidFrom,
    fareContractValidTo,
    fareContractState,
  );

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        {fareContractValidityStatus !== 'valid' && isInspectable ? (
          <ValidityHeader
            now={now}
            status={fareContractValidityStatus}
            validFrom={fareContractValidFrom}
            validTo={fareContractValidTo}
            isInspectable={isInspectable}
          />
        ) : (
          <UsedAccessValidityHeader
            now={now}
            status={usedAccessValidityStatus}
            validFrom={usedAccessValidFrom}
            validTo={usedAccessValidTo}
          />
        )}
        {isActiveValidity(usedAccessValidityStatus) && (
          <ValidityLine
            status="valid"
            now={now}
            validFrom={usedAccessValidFrom ?? 0}
            validTo={usedAccessValidTo ?? 0}
            isInspectable={isInspectable}
          />
        )}
        <TicketInfo
          // Slice to only show 1 traveller
          // makes no sense to show multiple for carnet travel rights
          travelRights={travelRights.slice(0, 1)}
          status={fareContractValidityStatus}
          isInspectable={isInspectable}
        />
      </Sections.GenericItem>
      <Sections.GenericItem>
        <CarnetFooter
          active={usedAccessValidityStatus === 'valid'}
          maximumNumberOfAccesses={maximumNumberOfAccesses}
          numberOfUsedAccesses={numberOfUsedAccesses}
        />
      </Sections.GenericItem>
    </Sections.Section>
  );
};

type LastUsedAccessState = {
  status: UsedAccessStatus;
  validFrom: number | undefined;
  validTo: number | undefined;
};

function useLastUsedAccess(
  now: number,
  usedAccesses: CarnetTicketUsedAccess[],
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

function getUsedAccessValidity(
  now: number,
  validFrom: number,
  validTo: number,
): UsedAccessStatus {
  if (now > validTo) return 'inactive';
  if (now < validFrom) return 'upcoming';
  return 'valid';
}

function isActiveValidity(status: UsedAccessStatus): boolean {
  switch (status) {
    case 'valid':
      return true;
    default:
      return false;
  }
}

export default CarnetTicketInfo;
