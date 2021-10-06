import {FareContract, isCarnetTicket, isPreactivatedTicket} from '@atb/tickets';
import {useTranslation} from '@atb/translations';
import React from 'react';
import PreactivatedTicketInfo from './PreactivatedTicketInfo';
import UnknownTicket from './UnknownTicket';
import CarnetTicketInfo from './CarnetTicketInfo';

type Props = {
  fareContract: FareContract;
  now: number;
  hideDetails?: boolean;
  onPressDetails?: () => void;
};

const SimpleTicket: React.FC<Props> = ({
  fareContract: fc,
  now,
  hideDetails,
  onPressDetails,
}) => {
  const {t} = useTranslation();

  const firstTravelRight = fc.travelRights?.[0];
  if (isPreactivatedTicket(firstTravelRight)) {
    return (
      <PreactivatedTicketInfo
        fareContractState={fc.state}
        travelRights={fc.travelRights.filter(isPreactivatedTicket)}
        now={now}
        hideDetails={hideDetails}
        onPressDetails={onPressDetails}
      />
    );
  } else if (isCarnetTicket(firstTravelRight)) {
    return (
      <CarnetTicketInfo
        fareContractState={fc.state}
        travelRights={fc.travelRights.filter(isCarnetTicket)}
        now={now}
      />
    );
  } else {
    return <UnknownTicket fc={fc} />;
  }
};

export default SimpleTicket;
