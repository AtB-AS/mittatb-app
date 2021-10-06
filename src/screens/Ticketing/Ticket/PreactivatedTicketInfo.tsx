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
  hideDetails?: boolean;
  onPressDetails?: () => void;
};

const PreactivatedTicketInfo: React.FC<Props> = ({
  fareContractState,
  travelRights,
  now,
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
          now={now}
          validFrom={validFrom}
          validTo={validTo}
        />
        <ValidityLine
          status={validityStatus}
          now={now}
          validFrom={validFrom}
          validTo={validTo}
        />

        <TicketInfo travelRights={travelRights} status={validityStatus} />
      </Sections.GenericItem>
      {!hideDetails && (
        <Sections.LinkItem
          text={t(
            validityStatus === 'valid'
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
