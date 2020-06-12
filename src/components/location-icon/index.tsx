import React from 'react';
import MapPointIcon from '../../assets/svg/MapPointIcon';
import BusSide from './svg/BusSide';
import {Location} from '../../favorites/types';
import TramSide from './svg/TramSide';
import TrainSide from './svg/TrainSide';
import FerrySide from './svg/FerrySide';
import PlaneAbove from './svg/PlaneAbove';
import {Category} from '../../sdk';
import {SvgProps} from 'react-native-svg';

const LocationIcon = ({
  location,
  fill = 'black',
  multiple,
}: {
  location: Location;
  fill?: string;
  multiple?: boolean;
}) => {
  const svgProps = {
    fill,
    width: 20,
  };
  switch (location.layer) {
    case 'address':
      return <MapPointIcon {...svgProps} />;
    case 'venue':
      const venueIconTypes = location.category
        .map(mapCategoryToVenueIconType)
        .filter((v, i, arr) => arr.indexOf(v) === i); // get distinct values

      if (!venueIconTypes.length) return <MapPointIcon {...svgProps} />;

      return multiple ? (
        <>{venueIconTypes.map((it) => mapTypeToIconComponent(it, svgProps))}</>
      ) : (
        mapTypeToIconComponent(venueIconTypes[0], svgProps)
      );

    default:
      return <MapPointIcon {...svgProps} />;
  }
};

const mapTypeToIconComponent = (
  iconType: VenueIconType,
  svgProps: SvgProps,
) => {
  switch (iconType) {
    case 'bus':
      return <BusSide key="bus" {...svgProps} />;
    case 'tram':
      return <TramSide key="tram" {...svgProps} />;
    case 'rail':
      return <TrainSide key="rail" {...svgProps} />;
    case 'airport':
      return <PlaneAbove key="airport" {...svgProps} />;
    case 'boat':
      return <FerrySide key="boat" {...svgProps} />;
    case 'unknown':
    default:
      return <MapPointIcon key="unknown" {...svgProps} />;
  }
};

const mapCategoryToVenueIconType = (category: Category) => {
  switch (category) {
    case 'onstreetBus':
    case 'busStation':
    case 'coachStation':
      return 'bus';
    case 'onstreetTram':
    case 'tramStation':
      return 'tram';
    case 'railStation':
    case 'metroStation':
      return 'rail';
    case 'airport':
      return 'airport';
    case 'harbourPort':
    case 'ferryPort':
    case 'ferryStop':
      return 'boat';
    default:
      return 'unknown';
  }
};

type VenueIconType = 'bus' | 'tram' | 'rail' | 'airport' | 'boat' | 'unknown';

export default LocationIcon;
