import React from 'react';
import {LocationWithSearchMetadata} from '../../location-search';
import LocationArrow from '../../assets/svg/LocationArrow';
import {FavoriteIcon} from '../../favorites';
import LocationIcon from '../../assets/svg/LocationIcon';
import {useFavorites} from '../../favorites/FavoritesContext';

type SearchLocationIconProps = {
  location?: LocationWithSearchMetadata;
};

export default function SearchLocationIcon({
  location,
}: SearchLocationIconProps) {
  const {favorites} = useFavorites();
  switch (location?.resultType) {
    case 'geolocation':
      return <LocationArrow />;
    case 'favorite':
      return (
        <FavoriteIcon
          favorite={favorites.find(f => f.name === location.favoriteName)}
        />
      );
    case 'search':
      return <LocationIcon location={location} />;
    default:
      return null;
  }
}
