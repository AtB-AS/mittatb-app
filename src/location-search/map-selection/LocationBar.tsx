import React from 'react';
import {Text, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import colors from '../../theme/colors';
import {LocationWithSearchMetadata} from '..';
import {ArrowRight} from '../../assets/svg/icons/navigation';
import {Location} from '../../favorites/types';
import LocationIcon from '../../components/location-icon';
import {StyleSheet} from '../../theme';
import shadows from './shadows';

type Props = {
  location?: Location;
  onSelect(location: LocationWithSearchMetadata): void;
};

const LocationBar: React.FC<Props> = ({location, onSelect}) => {
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
            <View style={{marginHorizontal: 12}}>
              {location ? <LocationIcon location={location} /> : null}
            </View>
            {location ? (
              <View>
                <Text style={styles.name}>{location.name}</Text>
                <Text style={styles.locality}>
                  {location.postalcode ? (
                    <Text>{location.postalcode}, </Text>
                  ) : null}
                  {location.locality}
                </Text>
              </View>
            ) : null}
          </View>
          <View style={styles.button}>
            {!location ? <ActivityIndicator /> : <ArrowRight />}
          </View>
        </View>
      </TouchableOpacity>
    </View>
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
  locationContainer: {flexDirection: 'row', alignItems: 'center'},
  name: {fontSize: 14, lineHeight: 20},
  locality: {fontSize: 12, lineHeight: 16},
  button: {
    width: 44,
    height: 44,
    borderRadius: 8,
    marginLeft: 8,
    backgroundColor: colors.secondary.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LocationBar;
