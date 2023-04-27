import {FareContract, isCarnetTravelRight} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {OrderDetails} from '@atb/fare-contracts/details/OrderDetails';
import {UnknownFareContractDetails} from '@atb/fare-contracts/details/UnknownFareContractDetails';
import {CarnetDetails} from '@atb/fare-contracts/carnet/CarnetDetails';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';

type Props = {
  fareContract: FareContract;
  now: number;
  onReceiptNavigate: () => void;
  isInspectable: boolean;
};

export const CarnetDetailedView: React.FC<Props> = ({
  fareContract: fc,
  now,
  onReceiptNavigate,
  isInspectable,
}) => {
  const {t} = useTranslation();
  const firstTravelRight = fc.travelRights[0];
  if (isCarnetTravelRight(firstTravelRight)) {
    return (
      <Section withBottomPadding>
        <CarnetDetails
          now={now}
          inspectable={isInspectable}
          travelRights={fc.travelRights.filter(isCarnetTravelRight)}
          fareContract={fc}
        />
        <GenericSectionItem>
          <OrderDetails fareContract={fc} />
        </GenericSectionItem>
        <LinkSectionItem
          text={t(FareContractTexts.details.askForReceipt)}
          onPress={onReceiptNavigate}
          accessibility={{accessibilityRole: 'button'}}
          testID="receiptButton"
        />
      </Section>
    );
  } else {
    return <UnknownFareContractDetails fc={fc} />;
  }
};
