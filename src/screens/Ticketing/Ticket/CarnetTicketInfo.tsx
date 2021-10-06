import * as Sections from '@atb/components/sections';
import {CarnetTicket, FareContractState} from '@atb/tickets';
import {useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import ValidityHeader from './ValidityHeader';
import ValidityLine from './ValidityLine';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {useTheme} from '@atb/theme';

type Props = {
  fareContractState: FareContractState;
  travelRights: CarnetTicket[];
  now: number;
};

const CarnetTicketInfo: React.FC<Props> = ({
  fareContractState,
  travelRights,
  now,
}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const firstTravelRight = travelRights[0];
  const {
    usedAccesses,
    maximumNumberOfAccesses,
    numberOfUsedAccesses,
  } = firstTravelRight;

  const [lastUsedAccess] = usedAccesses.slice(-1);
  const validTo = lastUsedAccess?.endDateTime.toMillis() ?? 0;
  const validFrom = lastUsedAccess?.startDateTime.toMillis();
  const validityStatus = getValidityStatus(
    now,
    validFrom,
    validTo,
    fareContractState,
  );

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityHeader
          status={validityStatus}
          now={now}
          validFrom={validFrom}
          validTo={validTo}
        />
        {usedAccesses?.length ? (
          <ValidityLine
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
          />
        ) : (
          <ValidityLine status="unknown" />
        )}

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

export default CarnetTicketInfo;
