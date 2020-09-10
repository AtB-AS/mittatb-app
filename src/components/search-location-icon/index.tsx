import React from 'react';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import {FavoriteIcon} from '../../favorites';
import LocationIcon from '../location-icon';
import {useFavorites} from '../../favorites/FavoritesContext';
import {LocationWithMetadata} from '../../favorites/types';

type SearchLocationIconProps = {
  location?: LocationWithMetadata;
};

export default function SearchLocationIcon({
  location,
}: SearchLocationIconProps) {
  const {favorites} = useFavorites();
  switch (location?.resultType) {
    case 'geolocation':
      return <CurrentLocationArrow />;
    case 'favorite':
      return (
        <FavoriteIcon
          favorite={favorites.find((f) => f.id === location.favoriteId)}
        />
      );
    case 'search':
      return <LocationIcon location={location} />;
    default:
      return null;
  }
}
