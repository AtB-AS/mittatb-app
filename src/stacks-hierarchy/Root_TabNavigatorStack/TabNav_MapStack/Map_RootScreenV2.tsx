import React, {useCallback} from 'react';
import {
  MapFilterType,
  MapV2,
  NavigateToTripSearchCallback as TravelFromAndToLocationsCallback,
} from '@atb/modules/map';
import {MapScreenProps} from './navigation-types';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import {useFocusEffect} from '@react-navigation/native';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {StatusBar} from 'react-native';

export type MapScreenParams = {
  initialFilters?: MapFilterType;
};

export const Map_RootScreenV2 = ({
  navigation,
}: MapScreenProps<'Map_RootScreen'>) => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  const {close} = useBottomSheetContext();

  useFocusEffect(
    useCallback(() => {
      return () => {
        // on screen blur (navigating away from map tab), close bottomsheet
        close();
      };
    }, [close]),
  );

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
    <>
      <StatusBar backgroundColor="blue" barStyle="light-content" />
      <MapV2
        navigateToQuay={navigateToQuay}
        navigateToDetails={navigateToDetails}
        navigateToTripSearch={navigateToTripSearch}
        includeSnackbar={true}
      />
    </>
  );
};
