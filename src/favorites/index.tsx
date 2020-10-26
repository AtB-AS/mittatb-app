import React from 'react';
import {Text} from 'react-native';
import {MapPointPin} from '../assets/svg/icons/places';
import ThemeIcon from '../components/themed-icon';

export type FavoriteIconProps = {
  favorite?: {emoji?: string};
};

export function FavoriteIcon({favorite}: FavoriteIconProps) {
  if (!favorite || !favorite.emoji) {
    return <ThemeIcon svg={MapPointPin} />;
  }
  return <Text>{favorite.emoji}</Text>;
}

export {
  useFavorites,
  default as FavoritesContextProvider,
} from './FavoritesContext';
