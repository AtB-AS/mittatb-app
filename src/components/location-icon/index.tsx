import React from 'react';
import {MapPointPin} from '../../assets/svg/icons/places';
import {
  BusSide,
  TramSide,
  TrainSide,
  FerrySide,
  PlaneSide,
} from '../../assets/svg/icons/transportation';
import {Location} from '../../favorites/types';
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
      return <MapPointPin {...svgProps} />;
    case 'venue':
      const venueIconTypes = location.category
        .map(mapCategoryToVenueIconType)
        .filter((v, i, arr) => arr.indexOf(v) === i); // get distinct values

      if (!venueIconTypes.length) return <MapPointPin {...svgProps} />;

      return multiple ? (
        <>{venueIconTypes.map((it) => mapTypeToIconComponent(it, svgProps))}</>
      ) : (
        mapTypeToIconComponent(venueIconTypes[0], svgProps)
      );

    default:
      return <MapPointPin {...svgProps} />;
  }
};

const mapTypeToIconComponent = (
  iconType: VenueIconType,
  svgProps: SvgProps,
) => {
  switch (iconType) {
    case 'bus':
      return <BusSide accessibilityLabel="Bussholdeplass" key="bus" {...svgProps} />;
    case 'tram':
      return <TramSide accessibilityLabel="Trikkeholdeplass" key="tram" {...svgProps} />;
    case 'rail':
      return <TrainSide accessibilityLabel="Togstasjon" key="rail" {...svgProps} />;
    case 'airport':
      return <PlaneSide accessibilityLabel="Flyplass" key="airport" {...svgProps} />;
    case 'boat':
      return <FerrySide accessibilityLabel="Fergeleie" key="boat" {...svgProps} />;
    case 'unknown':
    default:
      return <MapPointPin accessibilityLabel="Lokasjon" key="unknown" {...svgProps} />;
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
