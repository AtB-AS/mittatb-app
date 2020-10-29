import React from 'react';
import {MapPointPin} from '../assets/svg/icons/places';
import ThemeText from '../components/text';
import ThemeIcon from '../components/theme-icon';

export type FavoriteIconProps = {
  favorite?: {emoji?: string};
};

export function FavoriteIcon({favorite}: FavoriteIconProps) {
  if (!favorite || !favorite.emoji) {
    return <ThemeIcon svg={MapPointPin} />;
  }
  return <ThemeText>{favorite.emoji}</ThemeText>;
}

export {
  useFavorites,
  default as FavoritesContextProvider,
} from './FavoritesContext';
