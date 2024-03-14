import {
  FareContract,
  isCarnetTravelRight,
  isPreActivatedTravelRight,
} from '@atb/ticketing';
import React from 'react';
import {UnknownFareContract} from './UnknownFareContract';
import {FareContractView} from '@atb/fare-contracts/FareContractView';
import {StyleProp, ViewStyle} from 'react-native';

type Props = {
  fareContract: FareContract;
  now: number;
  isStatic?: boolean;
  sentToOthers?: boolean;
  onPressDetails?: () => void;
  hasActiveTravelCard?: boolean;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

export const SimpleFareContract: React.FC<Props> = ({
  fareContract: fc,
  now,
  isStatic,
  onPressDetails,
  testID,
  style,
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
        isStatic={isStatic}
        onPressDetails={onPressDetails}
        testID={testID}
        style={style}
      />
    );
  } else {
    return <UnknownFareContract fc={fc} />;
  }
};
