import * as Sections from '@atb/components/sections';
import {FareContractState, PreactivatedTicket} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import React from 'react';
import TicketInfo from './TicketInfo';
import ValidityHeader from './ValidityHeader';
import ValidityLine from './ValidityLine';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';

type Props = {
  fareContractState: FareContractState;
  travelRights: PreactivatedTicket[];
  now: number;
  isInspectable: boolean;
  hideDetails?: boolean;
  onPressDetails?: () => void;
};

const PreactivatedTicketInfo: React.FC<Props> = ({
  fareContractState,
  travelRights,
  now,
  isInspectable,
  hideDetails,
  onPressDetails,
}) => {
  const {t} = useTranslation();

  const firstTravelRight = travelRights[0];
  const {startDateTime, endDateTime} = firstTravelRight;
  const validTo = endDateTime.toMillis();
  const validFrom = startDateTime.toMillis();
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
          isInspectable={isInspectable}
          now={now}
          validFrom={validFrom}
          validTo={validTo}
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
        />
      )}
    </Sections.Section>
  );
};

export default PreactivatedTicketInfo;
