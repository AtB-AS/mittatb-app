import {AxiosError} from 'axios';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {secondsBetween} from '@atb/utils/date';
import {timeIsShort} from '../Details/utils';
import TripMessages from './TripMessages';
import TripSection, {InterchangeDetails, getPlaceName} from './TripSection';
import Summary from './TripSummary';
import {WaitDetails} from './WaitSection';
import {Leg, TripPattern} from '@atb/api/types/trips';
import Feedback from '@atb/components/feedback';

type TripProps = {
  tripPattern: TripPattern;
  error?: AxiosError;
};
const Trip: React.FC<TripProps> = ({tripPattern, error}) => {
  const styles = useStyle();

  return (
    <>
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
    </>
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
