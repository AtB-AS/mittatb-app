import {Feature, Point} from 'geojson';
import {MapRegion} from '@atb/components/map_v2';

export type MapPluginsSharedState = {
  selectedEntityId: string | undefined;
};

type MapPluginProps = {
  region: MapRegion | undefined;
  sharedState: MapPluginsSharedState;
  setSharedState: (ms: MapPluginsSharedState) => void;
};

export type MapPluginType = (props: MapPluginProps) => {
  handlePress: (features: Feature<Point>[]) => boolean;
  renderedFeature: JSX.Element | undefined;
};
