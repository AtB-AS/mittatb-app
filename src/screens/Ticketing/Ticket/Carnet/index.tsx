import * as Sections from '@atb/components/sections';
import {
  CarnetTicket,
  FareContractState,
  flattenCarnetTicketAccesses,
} from '@atb/tickets';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import ValidityLine from '../ValidityLine';
import {
  getRelativeValidity,
  getValidityStatus,
  RelativeValidityStatus,
} from '../utils';
import {useTheme} from '@atb/theme';
import TicketInfo from '../TicketInfo';
import CarnetValidityHeader from './CarnetValidityHeader';

type Props = {
  fareContractState: FareContractState;
  travelRights: CarnetTicket[];
  now: number;
  fareContractValidFrom: number;
  fareContractValidTo: number;
};

const CarnetTicketInfo: React.FC<Props> = ({
  fareContractState,
  travelRights,
  now,
  fareContractValidFrom,
  fareContractValidTo,
}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const {
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  } = flattenCarnetTicketAccesses(travelRights);

  const [lastUsedAccess] = usedAccesses.slice(-1);
  const usedAccessValidFrom = lastUsedAccess?.startDateTime.toMillis();
  const usedAccessValidTo = lastUsedAccess?.endDateTime.toMillis();
  const usedAccessValidityStatus = getRelativeValidity(
    now,
    usedAccessValidFrom,
    usedAccessValidTo,
  );
  const fareContractValidityStatus = getValidityStatus(
    now,
    fareContractValidFrom,
    fareContractValidTo,
    fareContractState,
  );

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <CarnetValidityHeader
          fareContractStatus={fareContractValidityStatus}
          usedAccessStatus={usedAccessValidityStatus}
          now={now}
          usedAccessValidFrom={usedAccessValidFrom}
          usedAccessValidTo={usedAccessValidTo}
          maximumNumberOfAccesses={maximumNumberOfAccesses}
          numberOfUsedAccesses={numberOfUsedAccesses}
        />
        {isActiveValidity(usedAccessValidityStatus) && (
          <ValidityLine
            status={'unknown'}
            now={now}
            validFrom={usedAccessValidFrom}
            validTo={usedAccessValidTo}
          />
        )}
      </Sections.GenericItem>
      <Sections.GenericItem>
        <TicketInfo
          travelRights={travelRights}
          status={usedAccessValidityStatus}
        />
      </Sections.GenericItem>
      <Sections.GenericItem>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {Array(maximumNumberOfAccesses)
            .fill(true)
            .map((_, idx) => idx < numberOfUsedAccesses)
            .reverse()
            .map((isUnused, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: theme.colors.primary_2.backgroundColor,
                  borderRadius: 20,
                  padding: 2,
                  margin: 2,
                }}
              >
                <View
                  style={{
                    backgroundColor: isUnused
                      ? theme.colors.primary_2.color
                      : 'transparent',
                    borderRadius: 20,
                    width: 14,
                    height: 14,
                  }}
                />
              </View>
            ))}
        </View>
      </Sections.GenericItem>
    </Sections.Section>
  );
};

function isActiveValidity(status: RelativeValidityStatus): boolean {
  switch (status) {
    case 'valid':
    case 'upcoming':
      return true;
    default:
      return false;
  }
}

export default CarnetTicketInfo;
