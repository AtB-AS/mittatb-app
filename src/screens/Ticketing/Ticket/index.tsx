import {
  FareContract,
  isCarnetTicket,
  isPreactivatedTicket,
  isSingleTicket,
} from '@atb/tickets';
import {useTranslation} from '@atb/translations';
import React from 'react';
import PreactivatedTicketInfo from './PreactivatedTicketInfo';
import UnknownTicket from './UnknownTicket';
import Carnet from './Carnet';

type Props = {
  fareContract: FareContract;
  now: number;
  hideDetails?: boolean;
  onPressDetails?: () => void;
  hasActiveTravelCard?: boolean;
};

const SimpleTicket: React.FC<Props> = ({
  fareContract: fc,
  now,
  hideDetails,
  onPressDetails,
  hasActiveTravelCard = false,
}) => {
  const firstTravelRight = fc.travelRights?.[0];
  const isInspectable =
    !hasActiveTravelCard && isSingleTicket(firstTravelRight);
  if (isPreactivatedTicket(firstTravelRight)) {
    return (
      <PreactivatedTicketInfo
        fareContractState={fc.state}
        travelRights={fc.travelRights.filter(isPreactivatedTicket)}
        now={now}
        isInspectable={isInspectable}
        hideDetails={hideDetails}
        onPressDetails={onPressDetails}
      />
    );
  } else if (isCarnetTicket(firstTravelRight)) {
    return (
      <Carnet
        fareContractState={fc.state}
        travelRights={fc.travelRights.filter(isCarnetTicket)}
        now={now}
        isInspectable={isInspectable}
      />
    );
  } else {
    return <UnknownTicket fc={fc} />;
  }
};

export default SimpleTicket;
