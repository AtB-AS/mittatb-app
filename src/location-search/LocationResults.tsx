import React from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StyleSheet} from '../theme';
import {Location} from '../favorites/types';
import MapPointIcon from '../assets/svg/MapPointIcon';
import BusFront from '../assets/svg/BusFront';

type Props = {
  title: string;
  locations: Location[];
  onSelect: (location: Location) => void;
};

const LocationResults: React.FC<Props> = ({title, locations, onSelect}) => {
  const styles = useThemeStyles();
  return (
    <>
      <View style={styles.subHeader}>
        <Text style={styles.subLabel}>{title}</Text>
        <View style={styles.subBar} />
      </View>
      <View style={styles.list}>
        {locations.map(location => (
          <TouchableOpacity
            key={location.id}
            onPress={() => onSelect?.(location)}
            style={styles.button}
          >
            <LocationIcon
              location={location}
              fill={styles.locationIcon.backgroundColor}
            />
            <Text style={styles.buttonText}>
              {location.name}, {location.locality}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

const LocationIcon = ({
  location,
  fill,
}: {
  location: Location;
  fill?: string;
}) => {
  const svgProps = {
    fill,
    width: 10,
  };
  switch (location.layer) {
    case 'address':
      return <MapPointIcon {...svgProps} />;
    case 'venue':
      return <BusFront {...svgProps} />;
    default:
      return <MapPointIcon {...svgProps} />;
  }
};

export default LocationResults;

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  subHeader: {
    flexDirection: 'row',
  },
  subLabel: {
    color: theme.text.faded,
    fontSize: 12,
    marginRight: 12,
  },
  subBar: {
    height: 12,
    flexGrow: 1,
    borderBottomColor: theme.text.faded,
    borderBottomWidth: 1,
  },
  list: {
    marginVertical: 24,
  },
  button: {
    padding: 12,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 16,
  },
  locationIcon: {
    backgroundColor: theme.text.primary,
  },
}));
