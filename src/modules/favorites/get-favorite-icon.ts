import type {FavoriteDeparture} from './types';
import SvgFavorite from '@atb/assets/svg/mono-icons/places/Favorite';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';
import {StoredType} from './storage';

export const getFavoriteIcon = (
  existingFavorite?: StoredType<FavoriteDeparture>,
) => {
  if (!existingFavorite) {
    return SvgFavorite;
  } else if (existingFavorite.destinationDisplay) {
    return SvgFavoriteSemi;
  } else {
    return SvgFavoriteFill;
  }
};
