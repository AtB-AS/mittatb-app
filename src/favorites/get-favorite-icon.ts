import type {StoredType} from '@atb/favorites/storage';
import type {FavoriteDeparture} from '@atb/favorites/types';
import SvgFavorite from '@atb/assets/svg/mono-icons/places/Favorite';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';

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
