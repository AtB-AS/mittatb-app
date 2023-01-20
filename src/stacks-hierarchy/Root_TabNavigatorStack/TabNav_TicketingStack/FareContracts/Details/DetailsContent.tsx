import * as Sections from '@atb/components/sections';
import {
  FareContract,
  isInspectableTravelRight,
  isPreActivatedTravelRight,
} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import FareContractInfo from '../FareContractInfo';
import ValidityHeader from '../ValidityHeader';
import ValidityLine from '../ValidityLine';
import {getValidityStatus} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/utils';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import OrderDetails from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/Details/OrderDetails';
import {UnknownFareContractDetails} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_TicketingStack/FareContracts/Details/UnknownFareContractDetails';
import {PreassignedFareProduct} from '@atb/reference-data/types';

type Props = {
  fareContract: FareContract;
  preassignedFareProduct?: PreassignedFareProduct;
  now: number;
  onReceiptNavigate: () => void;
  hasActiveTravelCard?: boolean;
};

const DetailsContent: React.FC<Props> = ({
  fareContract: fc,
  preassignedFareProduct,
  now,
  onReceiptNavigate,
  hasActiveTravelCard = false,
}) => {
  const {t} = useTranslation();
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
  } = useMobileTokenContextState();

  const firstTravelRight = fc.travelRights[0];

  if (isPreActivatedTravelRight(firstTravelRight)) {
    const validFrom = firstTravelRight.startDateTime.toMillis();
    const validTo = firstTravelRight.endDateTime.toMillis();
    const isInspectable = isInspectableTravelRight(
      firstTravelRight,
      hasActiveTravelCard,
      hasEnabledMobileToken,
      deviceIsInspectable,
      mobileTokenError,
      fallbackEnabled,
    );

    const validityStatus = getValidityStatus(now, validFrom, validTo, fc.state);
    return (
      <Sections.Section withBottomPadding>
        <Sections.GenericSectionItem>
          <ValidityHeader
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
            isInspectable={isInspectable}
            fareProductType={preassignedFareProduct?.type}
          />
          <ValidityLine
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
            isInspectable={isInspectable}
          />
          <FareContractInfo
            travelRights={fc.travelRights.filter(isPreActivatedTravelRight)}
            status={validityStatus}
            isInspectable={isInspectable}
            testID={'details'}
            fareContract={fc}
            fareProductType={preassignedFareProduct?.type}
          />
        </Sections.GenericSectionItem>
        <Sections.GenericSectionItem>
          <OrderDetails fareContract={fc} />
        </Sections.GenericSectionItem>
        <Sections.LinkSectionItem
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

export default DetailsContent;
