import {insets} from '@atb/utils/insets';
import {ThemeIcon} from '@atb/components/theme-icon';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import SvgFavorite from '@atb/assets/svg/mono-icons/places/Favorite';
import {StoredType} from './storage';
import {FavoriteDeparture} from './types';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';

type Props = {
  onMarkFavourite?: () => void;
  existingFavorite?: StoredType<FavoriteDeparture>;
  toggleFavouriteAccessibilityLabel?: string;
};

export const FavouriteDepartureToggle = ({
  onMarkFavourite,
  existingFavorite,
  toggleFavouriteAccessibilityLabel,
}: Props) => {
  const style = useStyles();
  const {t} = useTranslation();

  return (
    <PressableOpacity
      onPress={onMarkFavourite}
      accessibilityRole="checkbox"
      accessibilityState={{checked: !!existingFavorite}}
      accessibilityLabel={toggleFavouriteAccessibilityLabel}
      accessibilityHint={
        !!existingFavorite
          ? t(FavoriteDeparturesTexts.favoriteItemDelete.a11yHint)
          : t(FavoriteDeparturesTexts.favoriteItemAdd.a11yHint)
      }
      accessible={!!toggleFavouriteAccessibilityLabel}
      importantForAccessibility={
        !!toggleFavouriteAccessibilityLabel ? 'yes' : 'no'
      }
      hitSlop={insets.symmetric(14, 8)}
      style={style.favoriteButton}
      disabled={!onMarkFavourite}
      testID={getFavoriteIconTestID(existingFavorite)}
    >
      <ThemeIcon svg={getFavoriteIcon(existingFavorite)} />
    </PressableOpacity>
  );
};

const getFavoriteIcon = (existingFavorite?: StoredType<FavoriteDeparture>) => {
  if (!existingFavorite) {
    return SvgFavorite;
  } else if (existingFavorite.destinationDisplay) {
    return SvgFavoriteSemi;
  } else {
    return SvgFavoriteFill;
  }
};

const getFavoriteIconTestID = (
  existingFavorite?: StoredType<FavoriteDeparture>,
) => {
  if (!existingFavorite) {
    return 'noFavorite';
  } else if (existingFavorite.destinationDisplay) {
    return 'semiFavorite';
  } else {
    return 'allFavorite';
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  favoriteButton: {
    paddingLeft: theme.spacings.medium,
  },
}));
