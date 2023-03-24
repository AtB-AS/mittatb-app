import React, {useEffect} from 'react';
import {
  Map,
  NavigateToTripSearchCallback as TravelFromAndToLocationsCallback,
} from '@atb/components/map';
import {MapScreenProps} from './navigation-types';
import {Quay, StopPlace} from '@atb/api/types/departures';
import useIsScreenReaderEnabled from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import {StatusBarOnFocus} from '@atb/components/status-bar-on-focus';
import {useCityBikeStations, useVehicles} from '@atb/mobility';
import {useShouldShowScooterOnboarding} from './use-should-show-scooter-onboarding';

export const Map_RootScreen = ({
  navigation,
}: MapScreenProps<'Map_RootScreen'>) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const vehicles = useVehicles();
  const cityBikeStations = useCityBikeStations();

  const shouldShowScooterOnboarding = useShouldShowScooterOnboarding();
  useEffect(() => {
    if (shouldShowScooterOnboarding && !isScreenReaderEnabled) {
      navigation.navigate('Map_ScooterOnboardingScreen');
    }
  }, [shouldShowScooterOnboarding, isScreenReaderEnabled]);

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
    date?: string,
    fromQuayId?: string,
    isTripCancelled?: boolean,
  ) => {
    if (!serviceJourneyId || !date) return;
    navigation.navigate('Map_DepartureDetailsScreen', {
      items: [
        {
          serviceJourneyId,
          serviceDate,
          date,
          fromQuayId,
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
      <StatusBarOnFocus barStyle="dark-content" />
      <Map
        selectionMode={'ExploreStops'}
        vehicles={vehicles}
        stations={cityBikeStations}
        navigateToQuay={navigateToQuay}
        navigateToDetails={navigateToDetails}
        navigateToTripSearch={navigateToTripSearch}
      />
    </>
  );
};
