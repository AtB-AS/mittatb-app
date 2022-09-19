import {Leg, TripPattern} from '@atb/api/types/trips';
import Feedback from '@atb/components/feedback';
import {StyleSheet} from '@atb/theme';
import {secondsBetween} from '@atb/utils/date';
import {AxiosError} from 'axios';
import React from 'react';
import {View} from 'react-native';
import TripMessages from './TripMessages';
import TripSection, {getPlaceName, InterchangeDetails} from './TripSection';
import Summary from './TripSummary';
import {WaitDetails} from './WaitSection';

type TripProps = {
  tripPattern: TripPattern;
  error?: AxiosError;
};
const Trip: React.FC<TripProps> = ({tripPattern, error}) => {
  const styles = useStyle();

  return (
    <View style={styles.container}>
      <TripMessages
        tripPattern={tripPattern}
        error={error}
        messageStyle={styles.message}
      />
      <View style={styles.trip}>
        {tripPattern &&
          tripPattern.legs.map((leg, index) => {
            return (
              <TripSection
                key={index}
                isFirst={index == 0}
                wait={legWaitDetails(index, tripPattern.legs)}
                isLast={index == tripPattern.legs.length - 1}
                step={index + 1}
                interchangeDetails={getInterchangeDetails(
                  tripPattern,
                  leg.interchangeTo?.toServiceJourney?.id,
                )}
                leg={leg}
                testID={'legContainer' + index}
              />
            );
          })}
      </View>
      <Summary {...tripPattern} />
      <Feedback metadata={tripPattern} viewContext="assistant" />
    </View>
  );
};

function legWaitDetails(index: number, legs: Leg[]): WaitDetails | undefined {
  const current = legs[index];
  const next = legs[index + 1];

  if (current && next) {
    const waitTimeInSeconds = secondsBetween(
      current.expectedEndTime,
      next.expectedStartTime,
    );

    const mustWaitForNextLeg = waitTimeInSeconds > 0;
    return {mustWaitForNextLeg, waitTimeInSeconds};
  }
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  message: {
    marginTop: theme.spacings.medium,
  },
  trip: {
    paddingTop: theme.spacings.large,
  },
  container: {
    paddingBottom: theme.spacings.medium,
  },
}));

function getInterchangeDetails(
  tripPattern: TripPattern,
  id: string | undefined,
): InterchangeDetails | undefined {
  if (!id) return undefined;
  const interchangeLeg = tripPattern.legs.find(
    (leg) => leg.line && leg.serviceJourney?.id === id,
  );

  if (interchangeLeg?.line?.publicCode) {
    return {
      publicCode: interchangeLeg.line.publicCode,
      fromPlace: getPlaceName(interchangeLeg.fromPlace),
    };
  }
  return undefined;
}

export default Trip;
