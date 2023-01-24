import {Leg, TripPattern} from '@atb/api/types/trips';
import {Feedback} from '@atb/components/feedback';
import {StyleSheet} from '@atb/theme';
import {secondsBetween} from '@atb/utils/date';
import {AxiosError} from 'axios';
import React from 'react';
import {View} from 'react-native';
import {TripMessages} from './DetailsMessages';
import TripSection, {getPlaceName, InterchangeDetails} from './TripSection';
import Summary from './TripSummary';
import {WaitDetails} from './WaitSection';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {isSignificantFootLegWalkOrWaitTime} from '@atb/travel-details-screens/utils';

export type TripProps = {
  tripPattern: TripPattern;
  error?: AxiosError;
  onPressDeparture: (
    items: ServiceJourneyDeparture[],
    activeItemIndex: number,
  ) => void;
  onPressQuay: (stopPlace: StopPlaceFragment, selectedQuayId?: string) => void;
};
const Trip: React.FC<TripProps> = ({
  tripPattern,
  error,
  onPressDeparture,
  onPressQuay,
}) => {
  const styles = useStyle();
  const legs = tripPattern.legs.filter((leg, i) =>
    isSignificantFootLegWalkOrWaitTime(leg, tripPattern.legs[i + 1]),
  );
  return (
    <View style={styles.container}>
      <TripMessages tripPattern={tripPattern} error={error} />
      <View style={styles.trip}>
        {tripPattern &&
          legs.map((leg, index) => {
            return (
              <TripSection
                key={index}
                isFirst={index == 0}
                wait={legWaitDetails(index, legs)}
                isLast={index == legs.length - 1}
                step={index + 1}
                interchangeDetails={getInterchangeDetails(
                  legs,
                  leg.interchangeTo?.toServiceJourney?.id,
                )}
                leg={leg}
                testID={'legContainer' + index}
                onPressDeparture={onPressDeparture}
                onPressQuay={onPressQuay}
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
  trip: {
    paddingTop: theme.spacings.medium,
  },
  container: {
    paddingBottom: theme.spacings.medium,
  },
}));

function getInterchangeDetails(
  legs: Leg[],
  id: string | undefined,
): InterchangeDetails | undefined {
  if (!id) return undefined;
  const interchangeLeg = legs.find(
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
