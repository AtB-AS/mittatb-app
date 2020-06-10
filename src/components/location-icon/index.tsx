import React from 'react';
import MapPointIcon from '../../assets/svg/MapPointIcon';
import BusFront from './svg/BusFront';
import {Location} from '../../favorites/types';
import TramFront from './svg/TramFront';
import TrainFront from './svg/TrainFront';
import BoatFront from './svg/BoatFront';
import PlaneFront from './svg/PlaneFront';
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
      return <BusFront key="bus" {...svgProps} height={16} />;
    case 'tram':
      return <TramFront key="tram" {...svgProps} height={16} />;
    case 'rail':
      return <TrainFront key="rail" {...svgProps} height={20} />;
    case 'airport':
      return <PlaneFront key="airport" {...svgProps} height={16} />;
    case 'boat':
      return <BoatFront key="boat" {...svgProps} height={16} />;
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
