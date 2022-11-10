import {TouchableOpacity} from 'react-native';
import insets from '@atb/utils/insets';
import ThemeIcon from '@atb/components/theme-icon';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import SvgFavorite from '@atb/assets/svg/mono-icons/places/Favorite';
import {StoredType} from '@atb/favorites/storage';
import {FavoriteDeparture} from '@atb/favorites/types';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';

type Props = {
  onMarkFavourite?: () => void;
  existingFavorite?: StoredType<FavoriteDeparture>;
  toggleFavouriteAccessibilityLabel?: string;
};

const ToggleFavouriteDeparture = ({
  onMarkFavourite,
  existingFavorite,
  toggleFavouriteAccessibilityLabel,
}: Props) => {
  const style = useStyles();
  return (
    <TouchableOpacity
      onPress={onMarkFavourite}
      accessibilityRole="checkbox"
      accessibilityState={{checked: !!existingFavorite}}
      accessibilityLabel={toggleFavouriteAccessibilityLabel}
      accessible={!!toggleFavouriteAccessibilityLabel}
      importantForAccessibility={
        !!toggleFavouriteAccessibilityLabel ? 'yes' : 'no'
      }
      hitSlop={insets.symmetric(14, 8)}
      style={style.favoriteButton}
      disabled={!onMarkFavourite}
    >
      <ThemeIcon svg={getFavoriteIcon(existingFavorite)} />
    </TouchableOpacity>
  );
};

const getFavoriteIcon = (existingFavorite?: StoredType<FavoriteDeparture>) => {
  if (!existingFavorite) {
    return SvgFavorite;
  } else if (existingFavorite.lineName) {
    return SvgFavoriteSemi;
  } else {
    return SvgFavoriteFill;
  }
};

const useStyles = StyleSheet.createThemeHook((theme, themeName) => ({
  favoriteButton: {
    paddingLeft: theme.spacings.medium,
  },
}));

export default ToggleFavouriteDeparture;
