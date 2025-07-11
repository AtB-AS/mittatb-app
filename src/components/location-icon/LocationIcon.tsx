import {Pin} from '@atb/assets/svg/mono-icons/map';
import {Location as LocationMonoIcon} from '@atb/assets/svg/mono-icons/places';
import {Location} from '@atb/modules/favorites';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {getVenueIconTypes} from './utils';
import {
  BusFill,
  FerryFill,
  PlaneFill,
  TrainFill,
  TramFill,
} from '@atb/assets/svg/mono-icons/transportation';

export const LocationIcon = ({
  location,
  multiple,
}: {
  location: Location;
  fill?: string;
  multiple?: boolean;
}) => {
  if (location.resultType === 'geolocation') {
    return <ThemeIcon svg={LocationMonoIcon} />;
  }
  switch (location.layer) {
    case 'address':
      return <ThemeIcon svg={Pin} />;
    case 'venue':
      const venueIconTypes = getVenueIconTypes(location.category);

      if (!venueIconTypes.length) {
        return <ThemeIcon svg={Pin} />;
      }

      return multiple ? (
        <>{venueIconTypes.map((it) => mapTypeToIconComponent(it))}</>
      ) : (
        mapTypeToIconComponent(venueIconTypes[0])
      );

    default:
      return <ThemeIcon svg={Pin} />;
  }
};

const mapTypeToIconComponent = (iconType: VenueIconType) => {
  switch (iconType) {
    case 'bus':
      return (
        <ThemeIcon
          svg={BusFill}
          accessibilityLabel="Bussholdeplass"
          key="bus"
        />
      );
    case 'tram':
      return (
        <ThemeIcon
          svg={TramFill}
          accessibilityLabel="Trikkeholdeplass"
          key="tram"
        />
      );
    case 'rail':
      return (
        <ThemeIcon svg={TrainFill} accessibilityLabel="Togstasjon" key="rail" />
      );
    case 'airport':
      return (
        <ThemeIcon
          svg={PlaneFill}
          accessibilityLabel="Flyplass"
          key="airport"
        />
      );
    case 'boat':
      return (
        <ThemeIcon svg={FerryFill} accessibilityLabel="Fergeleie" key="boat" />
      );
    case 'unknown':
    default:
      return (
        <ThemeIcon svg={Pin} accessibilityLabel="Lokasjon" key="unknown" />
      );
  }
};

type VenueIconType = 'bus' | 'tram' | 'rail' | 'airport' | 'boat' | 'unknown';
