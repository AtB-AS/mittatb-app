import {Pin} from '@atb/assets/svg/mono-icons/map';
import {Location as LocationMonoIcon} from '@atb/assets/svg/mono-icons/places';
import * as TransportationIcons from '@atb/assets/svg/mono-icons/transportation';
import * as EnturTransportationIcons from '@atb/assets/svg/mono-icons/transportation-entur';
import {Location} from '@atb/favorites';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {getVenueIconTypes} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';

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
          svg={TransportationIcons.Bus}
          accessibilityLabel="Bussholdeplass"
          key="bus"
        />
      );
    case 'tram':
      return (
        <ThemeIcon
          svg={TransportationIcons.Tram}
          accessibilityLabel="Trikkeholdeplass"
          key="tram"
        />
      );
    case 'rail':
      return (
        <ThemeIcon
          svg={TransportationIcons.Train}
          accessibilityLabel="Togstasjon"
          key="rail"
        />
      );
    case 'airport':
      return (
        <ThemeIcon
          svg={EnturTransportationIcons.Plane}
          accessibilityLabel="Flyplass"
          key="airport"
        />
      );
    case 'boat':
      return (
        <ThemeIcon
          svg={TransportationIcons.Ferry}
          accessibilityLabel="Fergeleie"
          key="boat"
        />
      );
    case 'unknown':
    default:
      return (
        <ThemeIcon svg={Pin} accessibilityLabel="Lokasjon" key="unknown" />
      );
  }
};

type VenueIconType = 'bus' | 'tram' | 'rail' | 'airport' | 'boat' | 'unknown';
