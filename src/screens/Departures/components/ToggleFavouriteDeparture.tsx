import {AccessibilityInfo, TouchableOpacity} from 'react-native';
import insets from '@atb/utils/insets';
import ThemeIcon from '@atb/components/theme-icon';
import React, {useRef} from 'react';
import {StyleSheet} from '@atb/theme';
import SvgFavorite from '@atb/assets/svg/mono-icons/places/Favorite';
import {NearbyTexts, useTranslation} from '@atb/translations';
import FavoriteDialogSheet from '@atb/departure-list/section-items/FavoriteDialogSheet';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {useFavorites} from '@atb/favorites';
import * as Types from '@atb/api/types/generated/journey_planner_v3_types';
import {StoredType} from '@atb/favorites/storage';
import {FavoriteDeparture} from '@atb/favorites/types';
import SvgFavoriteSemi from '@atb/assets/svg/mono-icons/places/FavoriteSemi';
import SvgFavoriteFill from '@atb/assets/svg/mono-icons/places/FavoriteFill';
import {Place, Quay} from '@atb/api/types/departures';

type Props = {
  line: {
    id: string;
    description?: string;
    lineNumber: string;
    transportMode?: Types.TransportMode;
    transportSubmode?: Types.TransportSubmode;
    lineName: string;
  };
  quay: Quay;
  stop: Place;
};

const ToggleFavouriteDeparture = ({line, quay, stop}: Props) => {
  const style = useStyles();
  const {t} = useTranslation();
  const {open: openBottomSheet} = useBottomSheet();
  const closeRef = useRef(null);
  const {addFavoriteDeparture, removeFavoriteDeparture, getFavoriteDeparture} =
    useFavorites();
  if (!line) {
    return null;
  }

  const addFavorite = async (forSpecificLineName: boolean) => {
    await addFavoriteDeparture({
      lineId: line.id,
      lineName: forSpecificLineName ? line.lineName : undefined,
      lineLineNumber: line.lineNumber,
      lineTransportationMode: line.transportMode,
      lineTransportationSubMode: line.transportSubmode,
      quayName: quay.name,
      quayPublicCode: quay.publicCode,
      quayId: quay.id,
      stopId: stop.id,
    });
    AccessibilityInfo.announceForAccessibility(
      t(NearbyTexts.results.lines.favorite.message.saved),
    );
  };

  const existingFavorite = getFavoriteDeparture({
    lineName: line.lineName,
    lineId: line.id,
    stopId: stop.id,
    quayId: quay.id,
  });
  const onFavoritePress = async () => {
    if (existingFavorite) {
      await removeFavoriteDeparture(existingFavorite.id);
      AccessibilityInfo.announceForAccessibility(
        t(NearbyTexts.results.lines.favorite.message.removed),
      );
    } else {
      openBottomSheet(
        (close, focusRef) => (
          <FavoriteDialogSheet
            lineName={line.lineName}
            lineNumber={line.lineNumber}
            addFavorite={addFavorite}
            close={close}
            ref={focusRef}
          />
        ),
        closeRef,
      );
    }
  };

  const label = existingFavorite
    ? t(
        NearbyTexts.results.lines.favorite.removeFavorite(
          `${line.lineNumber} ${existingFavorite.lineName ?? ''}`,
          stop.name,
        ),
      )
    : t(
        NearbyTexts.results.lines.favorite.addFavorite(
          `${line.lineNumber} ${line.lineName}`,
          stop.name,
        ),
      );

  return (
    <TouchableOpacity
      onPress={onFavoritePress}
      accessibilityRole="checkbox"
      accessibilityState={{checked: !!existingFavorite}}
      accessibilityLabel={label}
      hitSlop={insets.symmetric(14, 8)}
      style={style.favoriteButton}
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
