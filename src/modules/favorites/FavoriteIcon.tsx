import React from 'react';
import {Pin} from '@atb/assets/svg/mono-icons/map';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';

type FavoriteIconProps = {
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
