import * as Sections from '@atb/components/sections';
import {FareContractState, PreactivatedTicket} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import React from 'react';
import TicketInfo from './TicketInfo';
import ValidityHeader from './ValidityHeader';
import ValidityLine from './ValidityLine';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {useFirestoreConfiguration} from '@atb/configuration/FirestoreConfigurationContext';
import {findReferenceDataById} from '@atb/reference-data/utils';

type Props = {
  fareContractState: FareContractState;
  travelRights: PreactivatedTicket[];
  now: number;
  isInspectable: boolean;
  hideDetails?: boolean;
  onPressDetails?: () => void;
  testID?: string;
};

const PreactivatedTicketInfo: React.FC<Props> = ({
  fareContractState,
  travelRights,
  now,
  isInspectable,
  hideDetails,
  onPressDetails,
  testID,
}) => {
  const {t} = useTranslation();

  const firstTravelRight = travelRights[0];
  const {startDateTime, endDateTime} = firstTravelRight;
  const validTo = endDateTime.toMillis();
  const validFrom = startDateTime.toMillis();
  const {preassignedFareproducts} = useFirestoreConfiguration();
  const preassignedFareProduct = findReferenceDataById(
    preassignedFareproducts,
    firstTravelRight.fareProductRef,
  );

  const validityStatus = getValidityStatus(
    now,
    validFrom,
    validTo,
    fareContractState,
  );
  return (
    <Sections.Section withBottomPadding testID={testID}>
      <Sections.GenericItem>
        <ValidityHeader
          status={validityStatus}
          isInspectable={isInspectable}
          now={now}
          validFrom={validFrom}
          validTo={validTo}
          ticketType={preassignedFareProduct?.type}
        />
        <ValidityLine
          status={validityStatus}
          isInspectable={isInspectable}
          now={now}
          validFrom={validFrom}
          validTo={validTo}
        />

        <TicketInfo
          travelRights={travelRights}
          status={validityStatus}
          isInspectable={isInspectable}
          testID={testID}
          ticketType={preassignedFareProduct?.type}
        />
      </Sections.GenericItem>
      {!hideDetails && (
        <Sections.LinkItem
          text={t(
            validityStatus === 'valid' && isInspectable
              ? TicketTexts.detailsLink.valid
              : TicketTexts.detailsLink.notValid,
          )}
          onPress={onPressDetails}
          testID={testID + 'Details'}
        />
      )}
    </Sections.Section>
  );
};

export default PreactivatedTicketInfo;
