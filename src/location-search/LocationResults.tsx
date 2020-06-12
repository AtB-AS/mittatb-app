import React from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StyleSheet} from '../theme';
import {Location} from '../favorites/types';
import LocationIcon from '../components/location-icon';
import insets from '../utils/insets';
import {ArrowUpLeft} from '../assets/svg/icons/navigation';

type Props = {
  title: string;
  locations: Location[];
  onSelect: (location: Location) => void;
  onPrefillText: (text: string) => void;
};

const LocationResults: React.FC<Props> = ({
  title,
  locations,
  onSelect,
  onPrefillText,
}) => {
  const styles = useThemeStyles();
  return (
    <>
      <View style={styles.subHeader}>
        <Text style={styles.subLabel}>{title}</Text>
        <View style={styles.subBar} />
      </View>
      <View style={styles.list}>
        {locations.map((location) => (
          <View style={styles.rowContainer} key={location.id}>
            <TouchableOpacity
              onPress={() => onSelect(location)}
              style={styles.locationButton}
            >
              <View style={{flexDirection: 'column'}}>
                <LocationIcon
                  location={location}
                  fill={styles.locationIcon.backgroundColor}
                  multiple={true}
                />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locality}>{location.locality}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={insets.all(8)}
              onPressOut={() => onPrefillText(location.name + ' ')}
            >
              <ArrowUpLeft />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </>
  );
};

export default LocationResults;

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
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
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationButton: {
    padding: 12,
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    marginLeft: 16,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  locality: {
    fontSize: 12,
    marginTop: 4,
  },
  locationIcon: {
    backgroundColor: theme.text.primary,
  },
}));
