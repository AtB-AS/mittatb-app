import React from 'react';
import {Text} from 'react-native';
import {MapPointPin} from '../assets/svg/icons/places';
import ThemedIcon from '../components/themed-icon';

export type FavoriteIconProps = {
  favorite?: {emoji?: string};
};

export function FavoriteIcon({favorite}: FavoriteIconProps) {
  if (!favorite || !favorite.emoji) {
    return <ThemedIcon svg={MapPointPin} />;
  }
  return <Text>{favorite.emoji}</Text>;
}

export {
  useFavorites,
  default as FavoritesContextProvider,
} from './FavoritesContext';
