import {insets} from '@atb/utils/insets';
import {ThemeIcon} from '@atb/components/theme-icon';
import React from 'react';
import SvgFavorite from '@atb/assets/svg/mono-icons/places/Favorite';
import {StoredType} from './storage';
import {FavoriteDeparture} from './types';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {
  DeparturesTexts,
  FavoriteDeparturesTexts,
  useTranslation,
} from '@atb/translations';

type Props = {
  onMarkFavourite?: () => void;
  existingFavorite?: StoredType<FavoriteDeparture>;
  accessible?: boolean;
};

export const FavouriteDepartureToggle = ({
  onMarkFavourite,
  existingFavorite,
  accessible,
}: Props) => {
  const {t} = useTranslation();

  const accessibilityLabel = () => {
    if (!existingFavorite) {
      return '';
    } else if (existingFavorite.destinationDisplay) {
      return t(DeparturesTexts.favorites.favoriteButton.oneVariation);
    } else {
      return t(DeparturesTexts.favorites.favoriteButton.allVariations);
    }
  };

  return (
    <PressableOpacity
      onPress={onMarkFavourite}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel()}
      accessibilityHint={
        !!existingFavorite
          ? t(FavoriteDeparturesTexts.favoriteItemDelete.a11yHint)
          : t(FavoriteDeparturesTexts.favoriteItemAdd.a11yHint)
      }
      accessible={accessible}
      importantForAccessibility="yes"
      hitSlop={insets.symmetric(14, 8)}
      testID={getFavoriteIconTestID(existingFavorite)}
    >
      <ThemeIcon svg={getFavoriteIcon(existingFavorite)} />
    </PressableOpacity>
  );
};

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
