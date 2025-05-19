import React from 'react';
import {
  Map,
  MapFilterType,
  NavigateToTripSearchCallback as TravelFromAndToLocationsCallback,
} from '@atb/modules/map';
import {MapScreenProps} from './navigation-types';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import {StatusBarOnFocus} from '@atb/components/status-bar-on-focus';
import {useStations, useVehicles} from '@atb/modules/mobility';

export type MapScreenParams = {
  initialFilters?: MapFilterType;
};

export const Map_RootScreen = ({
  navigation,
  route,
}: MapScreenProps<'Map_RootScreen'>) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const mobilityFilters = route.params?.initialFilters?.mobility;
  const vehicles = useVehicles(mobilityFilters);
  const stations = useStations(mobilityFilters);

  if (isScreenReaderEnabled) return <MapDisabledForScreenReader />;

  const navigateToQuay = (place: StopPlace, quay: Quay) => {
    navigation.navigate('Map_PlaceScreen', {
      place,
      selectedQuayId: quay.id,
      mode: 'Departure',
    });
  };
  const navigateToDetails = (
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
  };
  const navigateToTripSearch: TravelFromAndToLocationsCallback = (
    location,
    destination,
  ) => {
    navigation.navigate({
      name: 'Dashboard_TripSearchScreen',
      params: {
        [destination]: location,
        callerRoute: {name: 'Map_RootScreen'},
      },
      merge: true,
    });
  };

  return (
    <>
      <StatusBarOnFocus barStyle="dark-content" backgroundColor="#00000000" />
      <Map
        vehicles={vehicles}
        stations={stations}
        navigateToQuay={navigateToQuay}
        navigateToDetails={navigateToDetails}
        navigateToTripSearch={navigateToTripSearch}
        includeSnackbar={true}
      />
    </>
  );
};
