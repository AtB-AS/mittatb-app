import {AccessibilityInfo, Alert} from 'react-native';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {Quay} from '@atb/api/types/departures';
import {FavoriteDialogSheet} from '@atb/departure-list/section-items/FavoriteDialogSheet';
import React, {RefObject} from 'react';
import {useBottomSheetContext} from '@atb/components/bottom-sheet';
import {
  TransportSubmode,
  TransportMode,
  DestinationDisplay,
} from '@atb/api/types/generated/journey_planner_v3_types';
import {animateNextChange} from '@atb/utils/animation';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';
import {useFavoritesContext} from './FavoritesContext';
import {StoredFavoriteDeparture} from './types';

export type FavouriteDepartureLine = {
  id: string;
  description?: string;
  lineNumber?: string;
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
  destinationDisplay?: DestinationDisplay;
};

export function useOnMarkFavouriteDepartures(
  quay: Pick<Quay, 'id' | 'name' | 'publicCode'>,
  addedFavoritesVisibleOnDashboard?: boolean,
) {
  const {addFavoriteDeparture, removeFavoriteDeparture, getFavoriteDeparture} =
    useFavoritesContext();
  const {t} = useTranslation();
  const {open: openBottomSheet, onOpenFocusRef} = useBottomSheetContext();
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
      quayId: quay.id,
    });

  const toggleFavouriteAccessibilityLabel = (line: FavouriteDepartureLine) => {
    const existing = getExistingFavorite(line);
    return existing
      ? t(
          DeparturesTexts.results.lines.favorite.removeFavorite(
            `${line.lineNumber} ${
              formatDestinationDisplay(t, existing.destinationDisplay) ?? ''
            }`,
            quay.name,
          ),
        )
      : t(
          DeparturesTexts.results.lines.favorite.addFavorite(
            `${line.lineNumber} ${formatDestinationDisplay(
              t,
              line.destinationDisplay,
            )}`,
            quay.name,
          ),
        );
  };

  const onMarkFavourite = (
    line: FavouriteDepartureLine,
    existing: StoredFavoriteDeparture | undefined,
    onCloseFocusRef: RefObject<any>,
  ) => {
    if (existing && line.lineNumber) {
      Alert.alert(
        t(DeparturesTexts.results.lines.favorite.delete.label),
        t(
          DeparturesTexts.results.lines.favorite.delete.confirmWarning(
            line.lineNumber,
            formatDestinationDisplay(t, existing.destinationDisplay) || '',
            existing.quayName,
          ),
        ),
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
    } else if (line.destinationDisplay && line.lineNumber && quay.name) {
      openBottomSheet(() => {
        return line.destinationDisplay && line.lineNumber ? (
          <FavoriteDialogSheet
            quayName={quay.name}
            destinationDisplay={line.destinationDisplay}
            lineNumber={line.lineNumber}
            addFavorite={(forSpecificLineName: boolean) =>
              addFavorite(line, forSpecificLineName)
            }
            ref={onOpenFocusRef}
          />
        ) : (
          <></>
        );
      }, onCloseFocusRef);
    }
  };

  return {
    onMarkFavourite,
    getExistingFavorite,
    toggleFavouriteAccessibilityLabel,
  };
}
