import {AccessibilityInfo, Alert} from 'react-native';
import {DeparturesTexts, useTranslation} from '@atb/translations';
import {Quay} from '@atb/api/types/departures';
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

export function useOnMarkFavouriteDepartures({
  quay,

  lineNumber,
  existing,
  addedFavoritesVisibleOnDashboard,
}: {
  quay: Pick<Quay, 'id' | 'name' | 'publicCode'>;
  lineNumber?: string;
  existing: StoredFavoriteDeparture | undefined;
  addedFavoritesVisibleOnDashboard?: boolean;
}) {
  const {addFavoriteDeparture, removeFavoriteDeparture} = useFavoritesContext();
  const {t} = useTranslation();

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

  const alert = () =>
    existing &&
    lineNumber &&
    Alert.alert(
      t(DeparturesTexts.results.lines.favorite.delete.label),
      t(
        DeparturesTexts.results.lines.favorite.delete.confirmWarning(
          lineNumber,
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

  return {
    alert,
    addFavorite,
  };
}
