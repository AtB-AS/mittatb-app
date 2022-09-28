import {Place, StopPlacePosition} from '@atb/api/types/departures';
import {useFavorites} from '@atb/favorites';
import {useGeolocationState} from '@atb/GeolocationContext';
import StopPlaces, {
  NoStopPlaceMessage,
} from '@atb/screens/Departures/components/StopPlaces';
import {useStopsDetailsData} from '@atb/screens/Departures/state/stop-place-details-state';
import {useTranslation} from '@atb/translations';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {coordinatesDistanceInMetres} from '@atb/utils/location';
import React, {useMemo, useState} from 'react';
import {NearbyPlacesScreenTabProps} from './types';

type RootProps = NearbyPlacesScreenTabProps<'FavouriteStopsOverview'>;

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
  }, [state.data, location]);

  const {t} = useTranslation();
  const navigateToPlace = (place: Place) => {
    navigation.navigate('PlaceScreen', {
      place,
      showOnlyFavoritesByDefault: true,
    });
  };

  return favouriteStopsDetails && favouriteStopsDetails.length > 0 ? (
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
