import {
  CarnetTicket,
  CarnetTicketUsedAccess,
  FareContract,
  flattenCarnetTicketAccesses,
} from '@atb/tickets';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import * as Sections from '@atb/components/sections';
import ValidityHeader from '@atb/screens/Ticketing/Ticket/ValidityHeader';
import UsedAccessValidityHeader from '@atb/screens/Ticketing/Ticket/Carnet/UsedAccessValidityHeader';
import ValidityLine from '@atb/screens/Ticketing/Ticket/ValidityLine';
import {View} from 'react-native';
import SectionSeparator from '@atb/components/sections/section-separator';
import TicketInfo from '@atb/screens/Ticketing/Ticket/TicketInfo';
import CarnetFooter from '@atb/screens/Ticketing/Ticket/Carnet/CarnetFooter';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {UsedAccessStatus} from '@atb/screens/Ticketing/Ticket/Carnet/types';

export function CarnetDetails(props: {
  now: number;
  inspectable: boolean;
  travelRights: CarnetTicket[];
  testID?: string;
  fareContract: FareContract;
}) {
  const fareContractValidFrom = props.travelRights[0].startDateTime.toMillis();
  const fareContractValidTo = props.travelRights[0].endDateTime.toMillis();
  const {now, inspectable, travelRights, fareContract} = props;
  const {usedAccesses, maximumNumberOfAccesses, numberOfUsedAccesses} =
    flattenCarnetTicketAccesses(travelRights);

  const {
    status: usedAccessValidityStatus,
    validFrom: usedAccessValidFrom,
    validTo: usedAccessValidTo,
  } = useLastUsedAccess(now, usedAccesses);

  const style = useStyles();
  const fareContractValidityStatus = getValidityStatus(
    now,
    fareContractValidFrom,
    fareContractValidTo,
    fareContract.state,
  );

  return (
    <Sections.Section>
      <Sections.GenericItem>
        {fareContractValidityStatus !== 'valid' ? (
          <ValidityHeader
            now={now}
            status={fareContractValidityStatus}
            validFrom={fareContractValidFrom}
            validTo={fareContractValidTo}
            isInspectable={inspectable}
            ticketType={'carnet'}
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
            ticketType={'carnet'}
          />
        ) : (
          <View style={style.container}>
            <SectionSeparator />
          </View>
        )}
        <TicketInfo
          travelRights={travelRights}
          status={fareContractValidityStatus}
          isInspectable={inspectable}
          omitUserProfileCount={true}
          testID={props.testID}
          ticketType={'carnet'}
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    marginVertical: theme.spacings.medium,
    marginHorizontal: -theme.spacings.medium,
    flexDirection: 'row',
  },
}));
