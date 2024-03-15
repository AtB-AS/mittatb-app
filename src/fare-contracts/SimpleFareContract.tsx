import {
  FareContract,
  isCarnetTravelRight,
  isPreActivatedTravelRight,
} from '@atb/ticketing';
import React from 'react';
import {UnknownFareContract} from './UnknownFareContract';
import {FareContractView} from '@atb/fare-contracts/FareContractView';
import {StyleSheet} from '@atb/theme';

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
  const styles = useStyles();

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
        style={styles.fareContract}
      />
    );
  } else {
    return <UnknownFareContract fc={fc} />;
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  fareContract: {
    paddingBottom: theme.spacings.large,
  },
}));
