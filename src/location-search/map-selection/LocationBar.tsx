import React from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import colors from '../../theme/colors';
import {ArrowRight} from '../../assets/svg/icons/navigation';
import {Info} from '../../assets/svg/icons/status';
import {Location, LocationWithMetadata} from '../../favorites/types';
import LocationIcon from '../../components/location-icon';
import {StyleSheet} from '../../theme';
import shadows from './shadows';

type Props = {
  location?: Location;
  onSelect(location: LocationWithMetadata): void;
  isSearching: boolean;
};

const LocationBar: React.FC<Props> = ({location, onSelect, isSearching}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{flex: 1}}
        onPress={() => {
          location && onSelect({...location, resultType: 'search'});
        }}
      >
        <View style={styles.innerContainer}>
          <View style={styles.locationContainer}>
            <Icon isSearching={isSearching} location={location} />
            <View style={{opacity: isSearching ? 0.6 : 1}}>
              <LocationText location={location} />
            </View>
          </View>
          {!isSearching && !!location && (
            <View style={styles.button}>
              <ArrowRight />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const Icon: React.FC<{isSearching: boolean; location?: Location}> = ({
  isSearching,
  location,
}) => {
  return (
    <View style={{marginHorizontal: 12}}>
      {isSearching ? (
        <ActivityIndicator />
      ) : location ? (
        <LocationIcon location={location} />
      ) : (
        <Info />
      )}
    </View>
  );
};

const LocationText: React.FC<{location?: Location}> = ({location}) => {
  return location ? (
    <>
      <Text style={styles.name}>{location.name}</Text>
      <Text style={styles.locality}>
        {location.postalcode ? <Text>{location.postalcode}, </Text> : null}
        {location.locality}
      </Text>
    </>
  ) : (
    <>
      <Text style={styles.name}>Fant ikke noe her :(</Text>
      <Text style={styles.locality}>Vennligst prøv et annet sted</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    ...shadows,
  },
  innerContainer: {
    paddingRight: 8,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.general.white,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  locationContainer: {flexDirection: 'row', alignItems: 'center', height: 44},
  name: {fontSize: 14, lineHeight: 20},
  locality: {fontSize: 12, lineHeight: 16},
  button: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationBar;
