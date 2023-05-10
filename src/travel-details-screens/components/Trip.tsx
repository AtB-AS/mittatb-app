import {Leg, TripPattern} from '@atb/api/types/trips';
import {Feedback} from '@atb/components/feedback';
import {StyleSheet, useTheme} from '@atb/theme';
import {secondsBetween} from '@atb/utils/date';
import {AxiosError} from 'axios';
import React from 'react';
import {View} from 'react-native';
import {TripMessages} from './DetailsMessages';
import {TripSection, getPlaceName, InterchangeDetails} from './TripSection';
import {TripSummary} from './TripSummary';
import {WaitDetails} from './WaitSection';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';
import {StopPlaceFragment} from '@atb/api/types/generated/fragments/stop-places';
import {isSignificantFootLegWalkOrWaitTime} from '@atb/travel-details-screens/utils';
import {
  CompactTravelDetailsMap,
  TravelDetailsMapScreenParams,
} from '@atb/travel-details-map-screen';
import {useGetServiceJourneyVehicles} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/use-get-service-journey-vehicles';
import {useRealtimeMapEnabled} from '@atb/components/map';
import {AnyMode} from '@atb/components/icon-box';
import {Divider} from '@atb/components/divider';
import {TripDetailsTexts, useTranslation} from '@atb/translations';

export type TripProps = {
  tripPattern: TripPattern;
  error?: AxiosError;
  onPressDetailsMap: (params: TravelDetailsMapScreenParams) => void;
  onPressDeparture: (
    items: ServiceJourneyDeparture[],
    activeItemIndex: number,
  ) => void;
  onPressQuay: (stopPlace: StopPlaceFragment, selectedQuayId?: string) => void;
};
export const Trip: React.FC<TripProps> = ({
  tripPattern,
  error,
  onPressDetailsMap,
  onPressDeparture,
  onPressQuay,
}) => {
  const styles = useStyle();
  const {theme} = useTheme();
  const {t} = useTranslation();

  const legs = tripPattern.legs.filter((leg, i) =>
    isSignificantFootLegWalkOrWaitTime(leg, tripPattern.legs[i + 1]),
  );

  const realtimeMapEnabled = useRealtimeMapEnabled();
  // avoid typescript errors on id
  const filterLegs = (id?: string): id is string => {
    return !!id;
  };
  // get vehicle position if there is realtime data for leg
  const ids = realtimeMapEnabled
    ? tripPattern.legs
        .map((leg) => (leg.realtime ? leg.serviceJourney?.id : undefined))
        .filter(filterLegs)
    : undefined;
  const {vehiclePositions} = useGetServiceJourneyVehicles(ids);

  const tripPatternLegs = tripPattern?.legs.map((leg) => {
    let mode: AnyMode = !!leg.bookingArrangements ? 'flex' : leg.mode;
    return {
      ...leg,
      mode,
    };
  });

  return (
    <View style={styles.container}>
      <TripMessages tripPattern={tripPattern} error={error} />
      <View style={styles.trip}>
        {tripPattern &&
          legs.map((leg, index) => {
            const legVehiclePosition = vehiclePositions?.find(
              (vehicle) =>
                vehicle.serviceJourney?.id === leg.serviceJourney?.id,
            );

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
                onPressShowLive={
                  legVehiclePosition
                    ? () =>
                        onPressDetailsMap({
                          legs: tripPattern.legs,
                          fromPlace: tripPattern.legs[0].fromPlace,
                          toPlace:
                            tripPattern.legs[tripPattern.legs.length - 1]
                              .toPlace,
                          vehicleWithPosition: legVehiclePosition,
                        })
                    : undefined
                }
                onPressDeparture={onPressDeparture}
                onPressQuay={onPressQuay}
              />
            );
          })}
      </View>
      <Divider style={{marginVertical: theme.spacings.medium}} />
      {tripPatternLegs && (
        <CompactTravelDetailsMap
          mapLegs={tripPatternLegs}
          fromPlace={tripPatternLegs[0]?.fromPlace}
          toPlace={tripPatternLegs[tripPatternLegs.length - 1].toPlace}
          buttonText={t(TripDetailsTexts.trip.summary.showTripInMap.label)}
          onExpand={() => {
            onPressDetailsMap({
              legs: tripPatternLegs,
              fromPlace: tripPatternLegs[0]?.fromPlace,
              toPlace: tripPatternLegs[tripPatternLegs.length - 1].toPlace,
            });
          }}
        />
      )}
      <TripSummary {...tripPattern} />
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
