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
  DestinationDisplay,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {animateNextChange} from '@atb/utils/animation';
import {
  ensureViaFormat,
  getDestinationLineName,
} from '@atb/travel-details-screens/utils';

type FavouriteDepartureLine = {
  id?: string;
  description?: string;
  lineNumber?: string;
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
  destinationDisplay?: DestinationDisplay;
};

export function useOnMarkFavouriteDepartures(
  line: FavouriteDepartureLine,
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

  const destinationDisplay = ensureViaFormat(line.destinationDisplay);

  if (!line.id || !destinationDisplay || !line.lineNumber) {
    return {onMarkFavourite: undefined, existingFavorite: undefined};
  }
  const lineName = getDestinationLineName(t, destinationDisplay);

  const addFavorite = async (forSpecificDestination: boolean) => {
    line.id &&
      (await addFavoriteDeparture({
        lineId: line.id,
        destinationDisplay: forSpecificDestination
          ? destinationDisplay
          : undefined,
        lineLineNumber: line.lineNumber,
        lineTransportationMode: line.transportMode,
        lineTransportationSubMode: line.transportSubmode,
        quayName: quay.name,
        quayPublicCode: quay.publicCode,
        quayId: quay.id,
        stopId: stopPlace.id,
        visibleOnDashboard: addedFavoritesVisibleOnDashboard,
      }));
    AccessibilityInfo.announceForAccessibility(
      t(NearbyTexts.results.lines.favorite.message.saved),
    );
  };

  const existingFavorite = getFavoriteDeparture({
    destinationDisplay,
    lineId: line.id,
    stopId: stopPlace.id,
    quayId: quay.id,
  });

  const toggleFavouriteAccessibilityLabel = existingFavorite
    ? t(
        NearbyTexts.results.lines.favorite.removeFavorite(
          `${line.lineNumber} ${
            getDestinationLineName(t, existingFavorite.destinationDisplay) ?? ''
          }`,
          stopPlace.name,
        ),
      )
    : t(
        NearbyTexts.results.lines.favorite.addFavorite(
          `${line.lineNumber} ${lineName}`,
          stopPlace.name,
        ),
      );

  const onMarkFavourite = () => {
    if (existingFavorite) {
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
              await removeFavoriteDeparture(existingFavorite.id);
              AccessibilityInfo.announceForAccessibility(
                t(NearbyTexts.results.lines.favorite.message.removed),
              );
            },
          },
        ],
      );
    } else if (destinationDisplay && line.lineNumber) {
      openBottomSheet(() =>
        destinationDisplay && line.lineNumber ? (
          <FavoriteDialogSheet
            destinationDisplay={destinationDisplay}
            lineNumber={line.lineNumber}
            addFavorite={addFavorite}
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
