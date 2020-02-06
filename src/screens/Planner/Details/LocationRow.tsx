import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import colors from '../../../assets/colors';

const LocationRow: React.FC<{
  icon: JSX.Element;
  location: string;
  time: string;
  textColor?: string;
}> = ({icon, location, time, textColor}) => {
  return (
    <View style={styles.row}>
      <View style={styles.iconLocationContainer}>
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.locationContainer}>
          <Text
            style={[styles.location, textColor ? {color: textColor} : null]}
          >
            {location}
          </Text>
        </View>
      </View>
      <View style={styles.timeContainer}>
        <Text style={[styles.time, textColor ? {color: textColor} : null]}>
          {time}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 2,
    flexShrink: 1,
  },
  iconContainer: {
    width: 18,
    alignItems: 'center',
    backgroundColor: colors.primary.gray,
    paddingVertical: 6,
    marginRight: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  location: {
    color: colors.general.white,
  },
  timeContainer: {flexGrow: 1, alignItems: 'flex-end'},
  time: {
    color: colors.general.white,
    fontSize: 12,
  },
});

export default LocationRow;
