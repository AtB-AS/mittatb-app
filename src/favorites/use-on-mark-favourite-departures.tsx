import {useFavorites} from '@atb/favorites';
import {AccessibilityInfo, Alert} from 'react-native';
import {NearbyTexts, useTranslation} from '@atb/translations';
import {Quay, StopPlace} from '@atb/api/types/departures';
import {FavoriteDialogSheet} from '@atb/departure-list/section-items/FavoriteDialogSheet';
import React from 'react';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import {
  TransportSubmode,
  TransportMode,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {animateNextChange} from '@atb/utils/animation';

type FavouriteDepartureLine = {
  id: string;
  description?: string;
  lineNumber?: string;
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
  lineName?: string;
};

export function useOnMarkFavouriteDepartures(
  quay: Quay,
  stopPlace: StopPlace,
  addedFavoritesVisibleOnDashboard?: boolean,
) {
  const {addFavoriteDeparture, removeFavoriteDeparture, getFavoriteDeparture} =
    useFavorites();
  const {t} = useTranslation();
  const {
    open: openBottomSheet,
    close: closeBottomSheet,
    onOpenFocusRef,
  } = useBottomSheet();
  const addFavorite = async (
    line: FavouriteDepartureLine,
    forSpecificLineName: boolean,
  ) => {
    await addFavoriteDeparture({
      lineId: line.id,
      lineName: forSpecificLineName ? line.lineName : undefined,
      lineLineNumber: line.lineNumber,
      lineTransportationMode: line.transportMode,
      lineTransportationSubMode: line.transportSubmode,
      quayName: quay.name,
      quayPublicCode: quay.publicCode,
      quayId: quay.id,
      stopId: stopPlace.id,
      visibleOnDashboard: addedFavoritesVisibleOnDashboard,
    });
    AccessibilityInfo.announceForAccessibility(
      t(NearbyTexts.results.lines.favorite.message.saved),
    );
  };

  const existingFavorite = (line: FavouriteDepartureLine) =>
    getFavoriteDeparture({
      lineName: line.lineName,
      lineId: line.id,
      stopId: stopPlace.id,
      quayId: quay.id,
    });

  const toggleFavouriteAccessibilityLabel = (line: FavouriteDepartureLine) => {
    const existing = existingFavorite(line);
    return existing
      ? t(
          NearbyTexts.results.lines.favorite.removeFavorite(
            `${line.lineNumber} ${existing.lineName ?? ''}`,
            stopPlace.name,
          ),
        )
      : t(
          NearbyTexts.results.lines.favorite.addFavorite(
            `${line.lineNumber} ${line.lineName}`,
            stopPlace.name,
          ),
        );
  };

  const onMarkFavourite = (line: FavouriteDepartureLine) => {
    const existing = existingFavorite(line);
    if (existing) {
      Alert.alert(
        t(NearbyTexts.results.lines.favorite.delete.label),
        t(NearbyTexts.results.lines.favorite.delete.confirmWarning),
        [
          {
            text: t(NearbyTexts.results.lines.favorite.delete.cancel),
            style: 'cancel',
          },
          {
            text: t(NearbyTexts.results.lines.favorite.delete.delete),
            style: 'destructive',
            onPress: async () => {
              animateNextChange();
              await removeFavoriteDeparture(existing.id);
              AccessibilityInfo.announceForAccessibility(
                t(NearbyTexts.results.lines.favorite.message.removed),
              );
            },
          },
        ],
      );
    } else if (line.lineName && line.lineNumber) {
      openBottomSheet(() =>
        line.lineName && line.lineNumber ? (
          <FavoriteDialogSheet
            lineName={line.lineName}
            lineNumber={line.lineNumber}
            addFavorite={(forSpecificLineName: boolean) =>
              addFavorite(line, forSpecificLineName)
            }
            close={closeBottomSheet}
            ref={onOpenFocusRef}
          />
        ) : (
          <></>
        ),
      );
    }
  };

  return {onMarkFavourite, existingFavorite, toggleFavouriteAccessibilityLabel};
}
