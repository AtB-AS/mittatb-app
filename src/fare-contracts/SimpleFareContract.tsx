import {
  FareContract,
  isCarnetTravelRight,
  isPreActivatedTravelRight,
} from '@atb/ticketing';
import React from 'react';
import {UnknownFareContract} from './UnknownFareContract';
import {FareContractView} from '@atb/fare-contracts/FareContractView';

type Props = {
  fareContract: FareContract;
  now: number;
  showSummarisedFareContract?: boolean;
  sentToOthers?: boolean;
  onPressDetails?: () => void;
  hasActiveTravelCard?: boolean;
  testID?: string;
};

export const SimpleFareContract: React.FC<Props> = ({
  fareContract: fc,
  now,
  showSummarisedFareContract,
  onPressDetails,
  testID,
}) => {
  const firstTravelRight = fc.travelRights?.[0];

  if (
    isPreActivatedTravelRight(firstTravelRight) ||
    isCarnetTravelRight(firstTravelRight)
  ) {
    return (
      <FareContractView
        now={now}
        fareContract={fc}
        showSummarisedFareContract={showSummarisedFareContract}
        onPressDetails={onPressDetails}
        testID={testID}
      />
    );
  } else {
    return <UnknownFareContract fc={fc} />;
  }
};
