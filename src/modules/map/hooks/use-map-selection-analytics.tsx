import {Feature, Point} from 'geojson';
import {useMemo} from 'react';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {isStopPlace} from '../utils';
import {
  isBicycleV2,
  isBikeStationV2,
  isCarStationV2,
  isScooterV2,
} from '@atb/modules/mobility';

export const useMapSelectionAnalytics = () => {
  const analytics = useAnalyticsContext();
  return useMemo(
    () => ({
      logMapSelection: (selectedFeature: Feature<Point>) => {
        if (isStopPlace(selectedFeature)) {
          analytics.logEvent('Map', 'Stop place selected', {
            id: selectedFeature.id,
          });
        } else if (isBikeStationV2(selectedFeature)) {
          analytics.logEvent('Map', 'City bike station selected', {
            id: selectedFeature.properties.id,
          });
        } else if (isCarStationV2(selectedFeature)) {
          analytics.logEvent('Map', 'Car sharing station selected', {
            id: selectedFeature.properties.id,
          });
        } else if (isScooterV2(selectedFeature)) {
          analytics.logEvent('Map', 'Scooter selected', {
            id: selectedFeature.properties.id,
          });
        } else if (isBicycleV2(selectedFeature)) {
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
