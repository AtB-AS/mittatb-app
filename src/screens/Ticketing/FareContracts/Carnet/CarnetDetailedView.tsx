import * as Sections from '@atb/components/sections';
import {FareContract, isCarnetTravelRight} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import OrderDetails from '@atb/screens/Ticketing/FareContracts/Details/OrderDetails';
import {UnknownFareContractDetails} from '@atb/screens/Ticketing/FareContracts/Details/UnknownFareContractDetails';
import {CarnetDetails} from '@atb/screens/Ticketing/FareContracts/Carnet/CarnetDetails';

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
  if (isCarnetTravelRight(firstTravelRight)) {
    return (
      <Sections.Section withBottomPadding>
        <CarnetDetails
          now={now}
          inspectable={isInspectable}
          travelRights={fc.travelRights.filter(isCarnetTravelRight)}
          fareContract={fc}
        />
        <Sections.GenericItem>
          <OrderDetails
            fareContract={fc}
            validTo={firstTravelRight.endDateTime.toDate()}
            validFrom={firstTravelRight.startDateTime.toDate()}
          />
        </Sections.GenericItem>
        <Sections.LinkItem
          text={t(FareContractTexts.details.askForReceipt)}
          onPress={onReceiptNavigate}
          accessibility={{accessibilityRole: 'button'}}
          testID="receiptButton"
        />
      </Sections.Section>
    );
  } else {
    return <UnknownFareContractDetails fc={fc} />;
  }
};

export default CarnetDetailedView;
