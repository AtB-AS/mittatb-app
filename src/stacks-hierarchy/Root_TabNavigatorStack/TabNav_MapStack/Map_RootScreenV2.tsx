import React, {useCallback} from 'react';
import {
  MapFilterType,
  MapV2,
  NavigateToTripSearchCallback as TravelFromAndToLocationsCallback,
} from '@atb/components/map';
import {MapScreenProps} from './navigation-types';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';

export type MapScreenParams = {
  initialFilters?: MapFilterType;
};

export const Map_RootScreenV2 = ({
  navigation,
}: MapScreenProps<'Map_RootScreen'>) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const navigateToQuay = useCallback(
    (place: StopPlace, quay: Quay) => {
      navigation.navigate('Map_PlaceScreen', {
        place,
        selectedQuayId: quay.id,
        mode: 'Departure',
      });
    },
    [navigation],
  );

  const navigateToDetails = useCallback(
    (
      serviceJourneyId: string,
      serviceDate: string,
      date: string | undefined,
      fromStopPosition: number,
      isTripCancelled?: boolean,
    ) => {
      if (!serviceJourneyId || !date) return;
      navigation.navigate('Map_DepartureDetailsScreen', {
        items: [
          {
            serviceJourneyId,
            serviceDate,
            date,
            fromStopPosition,
            isTripCancelled,
          },
        ],
        activeItemIndex: 0,
      });
    },
    [navigation],
  );
  const navigateToTripSearch: TravelFromAndToLocationsCallback = useCallback(
    (location, destination) => {
      navigation.navigate({
        name: 'Dashboard_TripSearchScreen',
        params: {
          [destination]: location,
          callerRoute: {name: 'Map_RootScreen'},
        },
        merge: true,
      });
    },
    [navigation],
  );

  if (isScreenReaderEnabled) return <MapDisabledForScreenReader />;

  return (
    <MapV2
      selectionMode="ExploreEntities"
      navigateToQuay={navigateToQuay}
      navigateToDetails={navigateToDetails}
      navigateToTripSearch={navigateToTripSearch}
      includeSnackbar={true}
    />
  );
};
