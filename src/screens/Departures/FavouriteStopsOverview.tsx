import React, {useMemo} from 'react';
import {useStopsDetailsData} from '@atb/screens/Departures/state/stop-place-details-state';
import {useFavorites} from '@atb/favorites';
import {Place, StopPlacePosition} from '@atb/api/types/departures';
import {CompositeNavigationProp} from '@react-navigation/native';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {useTranslation} from '@atb/translations';
import StopPlaces, {
  NoStopPlaceMessage,
} from '@atb/screens/Departures/components/StopPlaces';
import {StackNavigationProp} from '@react-navigation/stack';
import {DeparturesStackParams} from '@atb/screens/Departures/index';
import {RootStackParamList} from '@atb/navigation';
import {useGeolocationState} from '@atb/GeolocationContext';
import {coordinatesDistanceInMetres} from '@atb/utils/location';

type FavouritePlacesNavigationProp = CompositeNavigationProp<
  StackNavigationProp<DeparturesStackParams>,
  StackNavigationProp<RootStackParamList>
>;

type RootProps = {
  navigation: FavouritePlacesNavigationProp;
};

const FavouriteStopsOverview = ({navigation}: RootProps) => {
  const {favoriteDepartures} = useFavorites();
  const {location} = useGeolocationState();
  const favouriteStopIds = new Set(favoriteDepartures.map((fd) => fd.stopId));
  const {state} = useStopsDetailsData(Array.from(favouriteStopIds));

  const getDistanceFromCurrentLocation = (
    latitude?: number,
    longitude?: number,
  ) => {
    return (
      (location &&
        latitude &&
        longitude &&
        coordinatesDistanceInMetres(location.coordinates, {
          latitude: latitude,
          longitude: longitude,
        })) ||
      undefined
    );
  };

  const favouriteStopsDetails = useMemo(() => {
    return state.data?.stopPlaces
      .map((stopPlace): StopPlacePosition => {
        return {
          node: {
            distance: getDistanceFromCurrentLocation(
              stopPlace.latitude,
              stopPlace.longitude,
            ),
            place: {...stopPlace},
          },
        };
      })
      .sort((edgeA, edgeB) => {
        if (edgeA.node?.distance === undefined) return 1;
        if (edgeB.node?.distance === undefined) return -1;
        return edgeA.node?.distance > edgeB.node?.distance ? 1 : -1;
      });
  }, [state.data]);

  const {t} = useTranslation();
  const navigateToPlace = (place: Place) => {
    navigation.navigate('PlaceScreen', {
      place,
    });
  };

  return favouriteStopsDetails ? (
    <StopPlaces
      header={t(DeparturesTexts.resultType.favourites)}
      stopPlaces={favouriteStopsDetails}
      navigateToPlace={navigateToPlace}
      testID={'favouriteStopsContainerView'}
    />
  ) : (
    <NoStopPlaceMessage
      header={t(DeparturesTexts.resultType.favourites)}
      notStopPlaceMessage={t(DeparturesTexts.message.noFavourites)}
    />
  );
};

export default FavouriteStopsOverview;
