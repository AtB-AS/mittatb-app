import {
  FareContract,
  isCarnetTravelRight,
  isPreActivatedTravelRight,
} from '@atb/ticketing';
import React from 'react';
import {FareContractView} from '@atb/fare-contracts/FareContractView';

type Props = {
  fareContract: FareContract;
  now: number;
  isStatic?: boolean;
  sentToOthers?: boolean;
  onPressDetails?: () => void;
  hasActiveTravelCard?: boolean;
  testID?: string;
};

export const SimpleFareContract: React.FC<Props> = ({
  fareContract: fc,
  now,
  isStatic,
  onPressDetails,
  testID,
}) => {
  const firstTravelRight = fc.travelRights?.[0];

  if (
    !isPreActivatedTravelRight(firstTravelRight) &&
    !isCarnetTravelRight(firstTravelRight)
  ) {
    return null;
  }

  return (
    <FareContractView
      now={now}
      fareContract={fc}
      isStatic={isStatic}
      onPressDetails={onPressDetails}
      testID={testID}
    />
  );
};
