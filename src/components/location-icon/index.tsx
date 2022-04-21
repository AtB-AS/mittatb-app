import {Pin} from '@atb/assets/svg/mono-icons/map';
import * as TransportationIcons from '@atb/assets/svg/mono-icons/transportation';
import * as EnturTransportationIcons from '@atb/assets/svg/mono-icons/transportation-entur';
import {Location} from '@atb/favorites/types';
import {FeatureCategory} from '@atb/sdk';
import React from 'react';
import ThemeIcon from '@atb/components/theme-icon';

const LocationIcon = ({
  location,
  multiple,
}: {
  location: Location;
  fill?: string;
  multiple?: boolean;
}) => {
  if (location.resultType === 'geolocation') {
    return <ThemeIcon svg={CurrentLocationArrow} />;
  }
  switch (location.layer) {
    case 'address':
      return <ThemeIcon svg={Pin} />;
    case 'venue':
      const venueIconTypes = location.category
        .map(mapCategoryToVenueIconType)
        .filter((v, i, arr) => arr.indexOf(v) === i); // get distinct values

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
