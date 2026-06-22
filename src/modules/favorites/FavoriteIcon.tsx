import React from 'react';
import {Pin} from '@atb/assets/svg/mono-icons/map';
import {House} from '@atb/assets/svg/mono-icons/places';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {LocationFavorite} from './types';

type FavoriteIconProps = {
  favorite?: LocationFavorite;
  fill?: string;
};

export function FavoriteIcon({favorite, fill}: FavoriteIconProps) {
  if (!favorite || !favorite.emoji) {
    const fillProp = fill ? {fill} : undefined;
    return (
      <ThemeIcon
        svg={favorite?.location.housenumber ? House : Pin}
        {...fillProp}
      />
    );
  }
  return (
    <ThemeText style={fill ? {color: fill} : undefined}>
      {favorite.emoji}
    </ThemeText>
  );
}
