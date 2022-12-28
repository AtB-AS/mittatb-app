import React from 'react';
import {Pin} from '../assets/svg/mono-icons/map';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {UserFavoriteDepartures} from './types';

export type FavoriteIconProps = {
  favorite?: {emoji?: string};
  fill?: string;
};

export function FavoriteIcon({favorite, fill}: FavoriteIconProps) {
  if (!favorite || !favorite.emoji) {
    const fillProp = fill ? {fill} : undefined;
    return <ThemeIcon svg={Pin} {...fillProp} />;
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
