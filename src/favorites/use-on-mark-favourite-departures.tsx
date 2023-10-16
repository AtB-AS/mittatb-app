import {useFavorites, StoredFavoriteDeparture} from '@atb/favorites';
import {AccessibilityInfo, Alert} from 'react-native';
import {DeparturesTexts, useTranslation} from '@atb/translations';
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
import {getDestinationLineName} from '@atb/travel-details-screens/utils';

type FavouriteDepartureLine = {
  id: string;
  description?: string;
  lineNumber?: string;
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
  destinationDisplay?: DestinationDisplay;
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
    forSpecificDestination: boolean,
  ) => {
    await addFavoriteDeparture({
      lineId: line.id,
      destinationDisplay: forSpecificDestination
        ? line.destinationDisplay
        : undefined,
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
      t(DeparturesTexts.results.lines.favorite.message.saved),
    );
  };

  const getExistingFavorite = (line: FavouriteDepartureLine) =>
    getFavoriteDeparture({
      destinationDisplay: line.destinationDisplay,
      lineId: line.id,
      stopId: stopPlace.id,
      quayId: quay.id,
    });

  const toggleFavouriteAccessibilityLabel = (line: FavouriteDepartureLine) => {
    const existing: any = undefined;
    return existing
      ? t(
          DeparturesTexts.results.lines.favorite.removeFavorite(
            `${line.lineNumber} ${existing.lineName ?? ''}`,
            stopPlace.name,
          ),
        )
      : t(
          DeparturesTexts.results.lines.favorite.addFavorite(
            `${line.lineNumber} ${getDestinationLineName(
              t,
              line.destinationDisplay,
            )}`,
            stopPlace.name,
          ),
        );
  };

  const onMarkFavourite = (
    line: FavouriteDepartureLine,
    existing: StoredFavoriteDeparture | undefined,
  ) => {
    if (existing) {
      Alert.alert(
        t(DeparturesTexts.results.lines.favorite.delete.label),
        t(DeparturesTexts.results.lines.favorite.delete.confirmWarning),
        [
          {
            text: t(DeparturesTexts.results.lines.favorite.delete.cancel),
            style: 'cancel',
          },
          {
            text: t(DeparturesTexts.results.lines.favorite.delete.delete),
            style: 'destructive',
            onPress: async () => {
              animateNextChange();
              await removeFavoriteDeparture(existing.id);
              AccessibilityInfo.announceForAccessibility(
                t(DeparturesTexts.results.lines.favorite.message.removed),
              );
            },
          },
        ],
      );
    } else if (line.destinationDisplay && line.lineNumber) {
      openBottomSheet(() => {
        return line.destinationDisplay && line.lineNumber ? (
          <FavoriteDialogSheet
            destinationDisplay={line.destinationDisplay}
            lineNumber={line.lineNumber}
            addFavorite={(forSpecificLineName: boolean) =>
              addFavorite(line, forSpecificLineName)
            }
            close={closeBottomSheet}
            ref={onOpenFocusRef}
          />
        ) : (
          <></>
        );
      });
    }
  };

  return {
    onMarkFavourite,
    getExistingFavorite,
    toggleFavouriteAccessibilityLabel,
  };
}
