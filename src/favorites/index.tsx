import React from 'react';
import {MapPointPin} from '../assets/svg/icons/places';
import ThemeText from '../components/text';
import ThemeIcon from '../components/theme-icon';

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

export {
  useFavorites,
  default as FavoritesContextProvider,
} from './FavoritesContext';
