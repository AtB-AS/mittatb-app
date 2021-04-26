import {MapPointPin} from '@atb/assets/svg/icons/places';
import {
  BusSide,
  FerrySide,
  PlaneSide,
  TrainSide,
  TramSide,
} from '@atb/assets/svg/icons/transportation';
import {Location} from '@atb/favorites/types';
import {FeatureCategory} from '@atb/sdk';
import React from 'react';
import {SvgProps} from 'react-native-svg';
import ThemeIcon from '@atb/components/theme-icon';

const LocationIcon = ({
  location,
  multiple,
}: {
  location: Location;
  fill?: string;
  multiple?: boolean;
}) => {
  switch (location.layer) {
    case 'address':
      return <ThemeIcon svg={MapPointPin} />;
    case 'venue':
      const venueIconTypes = location.category
        .map(mapCategoryToVenueIconType)
        .filter((v, i, arr) => arr.indexOf(v) === i); // get distinct values

      if (!venueIconTypes.length) {
        return <ThemeIcon svg={MapPointPin} />;
      }

      return multiple ? (
        <>{venueIconTypes.map((it) => mapTypeToIconComponent(it))}</>
      ) : (
        mapTypeToIconComponent(venueIconTypes[0])
      );

    default:
      return <ThemeIcon svg={MapPointPin} />;
  }
};

const mapTypeToIconComponent = (iconType: VenueIconType) => {
  switch (iconType) {
    case 'bus':
      return (
        <ThemeIcon
          svg={BusSide}
          accessibilityLabel="Bussholdeplass"
          key="bus"
        />
      );
    case 'tram':
      return (
        <ThemeIcon
          svg={TramSide}
          accessibilityLabel="Trikkeholdeplass"
          key="tram"
        />
      );
    case 'rail':
      return (
        <ThemeIcon svg={TrainSide} accessibilityLabel="Togstasjon" key="rail" />
      );
    case 'airport':
      return (
        <ThemeIcon
          svg={PlaneSide}
          accessibilityLabel="Flyplass"
          key="airport"
        />
      );
    case 'boat':
      return (
        <ThemeIcon svg={FerrySide} accessibilityLabel="Fergeleie" key="boat" />
      );
    case 'unknown':
    default:
      return (
        <ThemeIcon
          svg={MapPointPin}
          accessibilityLabel="Lokasjon"
          key="unknown"
        />
      );
  }
};

const mapCategoryToVenueIconType = (category: FeatureCategory) => {
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
