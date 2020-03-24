import {LocationFavorite} from './types';
import React from 'react';
import {Text} from 'react-native';
import MapPointIcon from '../assets/svg/MapPointIcon';

export type FavoriteIconProps = {
  favorite?: LocationFavorite;
};

export function FavoriteIcon({favorite}: FavoriteIconProps) {
  if (!favorite || !favorite.emoji) {
    return <MapPointIcon />;
  }
  return <Text>{favorite.emoji}</Text>;
}
