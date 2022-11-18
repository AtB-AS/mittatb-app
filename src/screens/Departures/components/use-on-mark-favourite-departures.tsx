import {useFavorites} from '@atb/favorites';
import {AccessibilityInfo} from 'react-native';
import {NearbyTexts, useTranslation} from '@atb/translations';
import {StopPlace, Quay} from '@atb/api/types/departures';
import FavoriteDialogSheet from '@atb/departure-list/section-items/FavoriteDialogSheet';
import React, {useRef} from 'react';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import * as Types from '@atb/api/types/generated/journey_planner_v3_types';

type FavouriteDepartureLine = {
  id?: string;
  description?: string;
  lineNumber?: string;
  transportMode?: Types.TransportMode;
  transportSubmode?: Types.TransportSubmode;
  lineName?: string;
};

export function useOnMarkFavouriteDepartures(
  line: FavouriteDepartureLine,
  quay: Quay,
  stopPlace: StopPlace,
) {
  const {addFavoriteDeparture, removeFavoriteDeparture, getFavoriteDeparture} =
    useFavorites();
  const {t} = useTranslation();
  const {open: openBottomSheet} = useBottomSheet();
  const closeRef = useRef(null);
  if (!line.id || !line.lineName || !line.lineNumber) {
    return {onMarkFavourite: undefined, existingFavorite: undefined};
  }
  const addFavorite = async (forSpecificLineName: boolean) => {
    line.id &&
      (await addFavoriteDeparture({
        lineId: line.id,
        lineName: forSpecificLineName ? line.lineName : undefined,
        lineLineNumber: line.lineNumber,
        lineTransportationMode: line.transportMode,
        lineTransportationSubMode: line.transportSubmode,
        quayName: quay.name,
        quayPublicCode: quay.publicCode,
        quayId: quay.id,
        stopId: stopPlace.id,
        longitude: 0,
        latitude: 0,
      }));
    AccessibilityInfo.announceForAccessibility(
      t(NearbyTexts.results.lines.favorite.message.saved),
    );
  };

  const existingFavorite = getFavoriteDeparture({
    lineName: line.lineName,
    lineId: line.id,
    stopId: stopPlace.id,
    quayId: quay.id,
  });

  const toggleFavouriteAccessibilityLabel = existingFavorite
    ? t(
        NearbyTexts.results.lines.favorite.removeFavorite(
          `${line.lineNumber} ${existingFavorite.lineName ?? ''}`,
          stopPlace.name,
        ),
      )
    : t(
        NearbyTexts.results.lines.favorite.addFavorite(
          `${line.lineNumber} ${line.lineName}`,
          stopPlace.name,
        ),
      );

  const onMarkFavourite = () => {
    if (existingFavorite) {
      removeFavoriteDeparture(existingFavorite.id);
      AccessibilityInfo.announceForAccessibility(
        t(NearbyTexts.results.lines.favorite.message.removed),
      );
    } else if (line.lineName && line.lineNumber) {
      openBottomSheet(
        (close, focusRef) =>
          line.lineName && line.lineNumber ? (
            <FavoriteDialogSheet
              lineName={line.lineName}
              lineNumber={line.lineNumber}
              addFavorite={addFavorite}
              close={close}
              ref={focusRef}
            />
          ) : (
            <></>
          ),
        closeRef,
      );
    }
  };

  return {onMarkFavourite, existingFavorite, toggleFavouriteAccessibilityLabel};
}
