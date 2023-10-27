import {
  FareContract,
  isCarnetTravelRight,
  isInspectableTravelRight,
  isPreActivatedTravelRight,
} from '@atb/ticketing';
import React from 'react';
import {PreActivatedFareContractInfo} from './PreActivatedFareContractInfo';
import {UnknownFareContract} from './UnknownFareContract';
import {CarnetFareContractInfo} from './carnet/CarnetFareContractInfo';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';

type Props = {
  fareContract: FareContract;
  now: number;
  hideDetails?: boolean;
  onPressDetails?: () => void;
  hasActiveTravelCard?: boolean;
  testID?: string;
};

export const SimpleFareContract: React.FC<Props> = ({
  fareContract: fc,
  now,
  hideDetails,
  onPressDetails,
  testID,
}) => {
  const firstTravelRight = fc.travelRights?.[0];
  const {deviceIsInspectable, fallbackActive} = useMobileTokenContextState();
  const isInspectable = isInspectableTravelRight(
    deviceIsInspectable,
    fallbackActive,
  );

  if (isPreActivatedTravelRight(firstTravelRight)) {
    return (
      <PreActivatedFareContractInfo
        fareContractState={fc.state}
        travelRights={fc.travelRights.filter(isPreActivatedTravelRight)}
        now={now}
        isInspectable={isInspectable}
        hideDetails={hideDetails}
        onPressDetails={onPressDetails}
        testID={testID}
      />
    );
  } else if (isCarnetTravelRight(firstTravelRight)) {
    return (
      <CarnetFareContractInfo
        fareContract={fc}
        travelRights={fc.travelRights.filter(isCarnetTravelRight)}
        now={now}
        isInspectable={isInspectable}
        testID={testID}
      />
    );
  } else {
    return <UnknownFareContract fc={fc} />;
  }
};
