import {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import ScreenReaderAnnouncement from '../../../components/screen-reader-announcement';
import {Leg, TripPattern} from '../../../sdk';
import {StyleSheet} from '../../../theme';
import {secondsBetween} from '../../../utils/date';
import {timeIsShort} from '../Details/utils';
import TripMessages from './TripMessages';
import TripSection from './TripSection';
import Summary from './TripSummary';
import {WaitDetails} from './WaitSection';

type TripProps = {
  tripPattern: TripPattern;
  error?: AxiosError;
};
const Trip: React.FC<TripProps> = ({tripPattern, error}) => {
  const [shortTime, setShortTime] = useState<boolean>(false);
  const styles = useStyle();

  useEffect(() => {
    setShortTime(false);
  }, [tripPattern]);

  const flagWaitTime = (hasShortWait: boolean) => {
    // Only if not already flagged
    if (!shortTime && hasShortWait) {
      setShortTime(hasShortWait);
    }
  };

  return (
    <>
      <View style={styles.line} />
      <TripMessages
        error={error}
        shortTime={shortTime}
        messageStyle={styles.message}
      />
      <View style={styles.trip}>
        {tripPattern &&
          tripPattern.legs.map((leg, index) => {
            const {isFirst, waitDetails, isLast, hasShortWait} = getLegDetails(
              index,
              tripPattern.legs,
            );
            flagWaitTime(hasShortWait);
            return (
              <TripSection
                key={index}
                isFirst={isFirst}
                wait={waitDetails}
                isLast={isLast}
                step={index + 1}
                {...leg}
              />
            );
          })}
      </View>
      <View style={styles.line} />
      <Summary {...tripPattern} />
    </>
  );
};
type LegDetails = {
  waitDetails?: WaitDetails;
  isFirst: boolean;
  isLast: boolean;
  hasShortWait: boolean;
};
function getLegDetails(index: number, legs: Leg[]): LegDetails {
  const waitDetails = legWaitDetails(index, legs);
  const isFirst = index == 0;
  const isLast = index == legs.length - 1;
  const hasShortWait = !!(
    waitDetails?.waitAfter &&
    timeIsShort(waitDetails.waitSeconds) &&
    !isFirst
  );
  return {waitDetails, isFirst, isLast, hasShortWait};
}

function legWaitDetails(index: number, legs: Leg[]): WaitDetails | undefined {
  const next = legs.length > index + 1 && legs[index + 1];
  if (!next) {
    return;
  }
  const waitSeconds = secondsBetween(
    legs[index].expectedEndTime,
    next.expectedStartTime,
  );
  const waitAfter = next.mode !== 'foot' && waitSeconds > 0;

  return {waitAfter, waitSeconds};
}
const useStyle = StyleSheet.createThemeHook((theme) => ({
  line: {
    flex: 1,
    height: theme.border.width.slim,
    backgroundColor: theme.background.level1,
  },
  message: {
    marginTop: theme.spacings.medium,
  },
  trip: {
    paddingVertical: theme.spacings.medium,
  },
}));
export default Trip;
