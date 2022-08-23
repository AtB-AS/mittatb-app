import * as Sections from '@atb/components/sections';
import {FareContract, isCarnetTicket} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import React from 'react';
import OrderDetails from '@atb/screens/Ticketing/Ticket/Details/OrderDetails';
import {UnknownTicketDetails} from '@atb/screens/Ticketing/Ticket/Details/UnknownTicketDetails';
import {CarnetDetails} from '@atb/screens/Ticketing/Ticket/Carnet/CarnetDetails';

type Props = {
  fareContract: FareContract;
  now: number;
  onReceiptNavigate: () => void;
  isInspectable: boolean;
};

const CarnetDetailedView: React.FC<Props> = ({
  fareContract: fc,
  now,
  onReceiptNavigate,
  isInspectable,
}) => {
  const {t} = useTranslation();
  const firstTravelRight = fc.travelRights[0];
  if (isCarnetTicket(firstTravelRight)) {
    return (
      <Sections.Section withBottomPadding>
        <CarnetDetails
          now={now}
          inspectable={isInspectable}
          travelRights={fc.travelRights.filter(isCarnetTicket)}
          fareContract={fc}
        />
        <Sections.GenericItem>
          <OrderDetails fareContract={fc} />
        </Sections.GenericItem>
        <Sections.LinkItem
          text={t(TicketTexts.details.askForReceipt)}
          onPress={onReceiptNavigate}
          accessibility={{accessibilityRole: 'button'}}
          testID="receiptButton"
        />
      </Sections.Section>
    );
  } else {
    return <UnknownTicketDetails fc={fc} />;
  }
};

export default CarnetDetailedView;
