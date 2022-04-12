import React from 'react';
import {Location} from '@atb/assets/svg/mono-icons/places';
import {FavoriteIcon} from '@atb/favorites';
import LocationIcon from '@atb/components/location-icon';
import {useFavorites} from '@atb/favorites/FavoritesContext';
import {LocationWithMetadata} from '@atb/favorites/types';

type SearchLocationIconProps = {
  location?: LocationWithMetadata;
};

export default function SearchLocationIcon({
  location,
}: SearchLocationIconProps) {
  const {favorites} = useFavorites();
  switch (location?.resultType) {
    case 'geolocation':
      return <Location />;
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
