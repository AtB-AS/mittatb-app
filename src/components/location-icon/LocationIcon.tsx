import {Pin} from '@atb/assets/svg/mono-icons/map';
import {Location as LocationMonoIcon} from '@atb/assets/svg/mono-icons/places';
import {Location} from '@atb/modules/favorites';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {getVenueIconTypes} from './utils';
import {View} from 'react-native';
import {StyleSheet} from '@atb/theme';
import {TransportationIconBox} from '../icon-box';
import {
  TransportMode,
  TransportSubmode,
} from '@atb/api/types/generated/journey_planner_v3_types';

export const LocationIcon = ({
  location,
  multiple,
}: {
  location: Location;
  fill?: string;
  multiple?: boolean;
}) => {
  const styles = useStyles();

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
        <View style={styles.multipleIconsContainer}>
          {venueIconTypes.map((it) => mapTypeToIconComponent(it))}
        </View>
      ) : (
        mapTypeToIconComponent(venueIconTypes[0])
      );

    default:
      return <ThemeIcon svg={Pin} />;
  }
};

const mapTypeToIconComponent = (
  iconType: ReturnType<typeof getVenueIconTypes>[number],
) => {
  switch (iconType) {
    case 'bus':
      return (
        <TransportationIconBox
          mode={TransportMode.Bus}
          subMode={TransportSubmode.LocalBus}
        />
      );
    case 'tram':
      return <TransportationIconBox mode={TransportMode.Tram} />;
    case 'rail':
      return <TransportationIconBox mode={TransportMode.Rail} />;
    case 'metro':
      return <TransportationIconBox mode={TransportMode.Metro} />;
    case 'airport':
      return <TransportationIconBox mode={TransportMode.Air} />;
    case 'boat':
      return <TransportationIconBox mode={TransportMode.Water} />;
    case 'unknown':
    default:
      return (
        <ThemeIcon svg={Pin} accessibilityLabel="Lokasjon" key="unknown" />
      );
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  multipleIconsContainer: {
    flexDirection: 'row',
    gap: theme.spacing.small,
  },
}));
