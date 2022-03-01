import {
  FareContract,
  isCarnetTicket,
  isInspectable,
  isPreactivatedTicket,
} from '@atb/tickets';
import React from 'react';
import PreactivatedTicketInfo from './PreactivatedTicketInfo';
import UnknownTicket from './UnknownTicket';
import Carnet from './Carnet';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';

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
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {travelTokens} = useMobileTokenContextState();
  const inspectableToken = travelTokens?.find((t) => t.inspectable);
  const inspectable = isInspectable(
    firstTravelRight,
    hasActiveTravelCard,
    hasEnabledMobileToken,
    inspectableToken,
  );

  if (isPreactivatedTicket(firstTravelRight)) {
    return (
      <PreactivatedTicketInfo
        fareContractState={fc.state}
        travelRights={fc.travelRights.filter(isPreactivatedTicket)}
        now={now}
        isInspectable={inspectable}
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
        isInspectable={inspectable}
      />
    );
  } else {
    return <UnknownTicket fc={fc} />;
  }
};

export default SimpleTicket;
