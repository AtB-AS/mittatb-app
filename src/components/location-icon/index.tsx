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
  const svgProps = {
    width: 20,
  };
  switch (location.layer) {
    case 'address':
      return <ThemeIcon svg={MapPointPin} {...svgProps} />;
    case 'venue':
      const venueIconTypes = location.category
        .map(mapCategoryToVenueIconType)
        .filter((v, i, arr) => arr.indexOf(v) === i); // get distinct values

      if (!venueIconTypes.length)
        return <ThemeIcon svg={MapPointPin} {...svgProps} />;

      return multiple ? (
        <>{venueIconTypes.map((it) => mapTypeToIconComponent(it, svgProps))}</>
      ) : (
        mapTypeToIconComponent(venueIconTypes[0], svgProps)
      );

    default:
      return <ThemeIcon svg={MapPointPin} {...svgProps} />;
  }
};

const mapTypeToIconComponent = (
  iconType: VenueIconType,
  svgProps: SvgProps,
) => {
  switch (iconType) {
    case 'bus':
      return (
        <ThemeIcon
          svg={BusSide}
          accessibilityLabel="Bussholdeplass"
          key="bus"
          {...svgProps}
        />
      );
    case 'tram':
      return (
        <ThemeIcon
          svg={TramSide}
          accessibilityLabel="Trikkeholdeplass"
          key="tram"
          {...svgProps}
        />
      );
    case 'rail':
      return (
        <ThemeIcon
          svg={TrainSide}
          accessibilityLabel="Togstasjon"
          key="rail"
          {...svgProps}
        />
      );
    case 'airport':
      return (
        <ThemeIcon
          svg={PlaneSide}
          accessibilityLabel="Flyplass"
          key="airport"
          {...svgProps}
        />
      );
    case 'boat':
      return (
        <ThemeIcon
          svg={FerrySide}
          accessibilityLabel="Fergeleie"
          key="boat"
          {...svgProps}
        />
      );
    case 'unknown':
    default:
      return (
        <ThemeIcon
          svg={MapPointPin}
          accessibilityLabel="Lokasjon"
          key="unknown"
          {...svgProps}
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
