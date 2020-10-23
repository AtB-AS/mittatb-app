import React from 'react';
import {Text} from 'react-native';
import {MapPointPin} from '../assets/svg/icons/places';

export type FavoriteIconProps = {
  favorite?: {emoji?: string};
};

export function FavoriteIcon({favorite}: FavoriteIconProps) {
  if (!favorite || !favorite.emoji) {
    return <MapPointPin />;
  }
  return <Text>{favorite.emoji}</Text>;
}

export {
  useFavorites,
  default as FavoritesContextProvider,
} from './FavoritesContext';
