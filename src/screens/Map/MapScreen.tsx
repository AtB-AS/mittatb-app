import React from 'react';
import {Map} from '@atb/components/map';
import useIsScreenReaderEnabled from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import StatusBarOnFocus from '@atb/components/status-bar-on-focus';

export function MapScreen() {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  if (isScreenReaderEnabled) return <MapDisabledForScreenReader />;

  return (
    <>
      <StatusBarOnFocus barStyle="dark-content" />
      <Map selectionMode="ExploreStops" />
    </>
  );
}
