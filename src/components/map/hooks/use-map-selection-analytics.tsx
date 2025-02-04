import {Feature, Point} from 'geojson';
import {useMemo} from 'react';
import {isStopPlaceFeature} from '../utils';
import {useAnalyticsContext} from '@atb/analytics';
import {
  isBicycleFeature,
  isBikeStationFeature,
  isCarStationFeature,
  isScooterFeature,
} from '@atb/mobility/utils';

export const useMapSelectionAnalytics = () => {
  const analytics = useAnalyticsContext();
  return useMemo(
    () => ({
      logMapSelection: (selectedFeature: Feature<Point>) => {
        if (isStopPlaceFeature(selectedFeature)) {
          analytics.logEvent('Map', 'Stop place selected', {
            id: selectedFeature.id,
          });
        } else if (isBikeStationFeature(selectedFeature)) {
          analytics.logEvent('Map', 'City bike station selected', {
            id: selectedFeature.properties.id,
          });
        } else if (isCarStationFeature(selectedFeature)) {
          analytics.logEvent('Map', 'Car sharing station selected', {
            id: selectedFeature.properties.id,
          });
        } else if (isScooterFeature(selectedFeature)) {
          analytics.logEvent('Map', 'Scooter selected', {
            id: selectedFeature.properties.id,
          });
        } else if (isBicycleFeature(selectedFeature)) {
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
