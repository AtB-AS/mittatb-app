import React from 'react';
import MapPointIcon from '../assets/svg/MapPointIcon';
import BusFront from '../assets/svg/BusFront';
import {Location} from '../favorites/types';
import TramFront from '../assets/svg/TramFront';
import TrainFront from '../assets/svg/TrainFront';
import BoatFront from '../assets/svg/BoatFront';
import Plane from '../assets/svg/Plane';

const LocationIcon = ({
  location,
  fill,
}: {
  location: Location;
  fill?: string;
}) => {
  const svgProps = {
    fill,
    width: 20,
  };
  switch (location.layer) {
    case 'address':
      return <MapPointIcon {...svgProps} />;
    case 'venue':
      const firstCategory = location.category?.[0];
      switch (firstCategory) {
        case 'onstreetBus':
        case 'busStation':
        case 'coachStation':
          return <BusFront {...svgProps} height={16} />;
        case 'onstreetTram':
        case 'tramStation':
          return <TramFront {...svgProps} height={16} />;
        case 'railStation':
        case 'metroStation':
          return <TrainFront {...svgProps} height={20} />;
        case 'airport':
          return <Plane {...svgProps} height={16} />;
        case 'harbourPort':
        case 'ferryPort':
        case 'ferryStop':
          return <BoatFront {...svgProps} height={16} />;
        default:
          return <MapPointIcon {...svgProps} />;
      }
    default:
      return <MapPointIcon {...svgProps} />;
  }
};

export default LocationIcon;
