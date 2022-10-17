import React from 'react';
import {Map} from '@atb/components/map';
import useIsScreenReaderEnabled from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';

export function MapScreen() {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  if (isScreenReaderEnabled) return <MapDisabledForScreenReader />;

  return <Map selectionMode={'ExploreStops'} />;
}
