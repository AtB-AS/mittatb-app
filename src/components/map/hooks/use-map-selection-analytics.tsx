import {Feature, Point} from 'geojson';
import {useMemo} from 'react';
import {useAnalyticsContext} from '@atb/analytics';
import {isStopPlace} from '../utils';
import {
  isBicycle,
  isBikeStation,
  isCarStation,
  isScooter,
} from '@atb/mobility/utils';

export const useMapSelectionAnalytics = () => {
  const analytics = useAnalyticsContext();
  return useMemo(
    () => ({
      logMapSelection: (selectedFeature: Feature<Point>) => {
        if (isStopPlace(selectedFeature)) {
          analytics.logEvent('Map', 'Stop place selected', {
            id: selectedFeature.id,
          });
        } else if (isBikeStation(selectedFeature)) {
          analytics.logEvent('Map', 'City bike station selected', {
            id: selectedFeature.properties.id,
          });
        } else if (isCarStation(selectedFeature)) {
          analytics.logEvent('Map', 'Car sharing station selected', {
            id: selectedFeature.properties.id,
          });
        } else if (isScooter(selectedFeature)) {
          analytics.logEvent('Map', 'Scooter selected', {
            id: selectedFeature.properties.id,
          });
        } else if (isBicycle(selectedFeature)) {
          analytics.logEvent('Map', 'Bike selected', {
            id: selectedFeature.properties.id,
          });
        }
      },
      logEvent: analytics.logEvent,
    }),
    [analytics],
  );
};
