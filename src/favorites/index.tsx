import React from 'react';
import {MapPointPin} from '../assets/svg/icons/places';
import ThemeText from '../components/text';
import ThemeIcon from '../components/theme-icon';
import {FavoriteDeparture, UserFavoriteDepartures} from './types';

export type FavoriteIconProps = {
  favorite?: {emoji?: string};
  fill?: string;
};

export function FavoriteIcon({favorite, fill}: FavoriteIconProps) {
  if (!favorite || !favorite.emoji) {
    const fillProp = fill ? {fill} : undefined;
    return <ThemeIcon svg={MapPointPin} {...fillProp} />;
  }
  return (
    <ThemeText style={fill ? {color: fill} : undefined}>
      {favorite.emoji}
    </ThemeText>
  );
}

type FavoriteDepartureId = {
  stopId: string;
  lineName: string;
  lineId: string;
};
export function getFavoriteDeparture(
  line: FavoriteDepartureId,
  favorites: UserFavoriteDepartures,
) {
  return favorites.find(function (favorite) {
    return (
      favorite.lineId == line.lineId &&
      favorite.lineName == line.lineName &&
      favorite.stopId == line.stopId
    );
  });
}

export {
  useFavorites,
  default as FavoritesContextProvider,
} from './FavoritesContext';
