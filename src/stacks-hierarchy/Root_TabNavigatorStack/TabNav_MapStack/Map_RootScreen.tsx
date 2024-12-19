import React from 'react';
import {MapV2} from '@atb/components/map_v2';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {MapDisabledForScreenReader} from './components/MapDisabledForScreenReader';
import {StatusBarOnFocus} from '@atb/components/status-bar-on-focus';
import {MapFilterType} from "@atb/components/map";

export type MapScreenParams = {
    initialFilters?: MapFilterType;
};

export const Map_RootScreen = () => {
  const isScreenReaderEnabled = useIsScreenReaderEnabled();
  if (isScreenReaderEnabled) return <MapDisabledForScreenReader />;

  return (
    <>
      <StatusBarOnFocus barStyle="dark-content" backgroundColor="#00000000" />
      <MapV2 />
    </>
  );
};
