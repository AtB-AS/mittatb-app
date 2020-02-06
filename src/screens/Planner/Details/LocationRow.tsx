import React from 'react';
import {View, Text, StyleSheet, TextStyle} from 'react-native';
import colors from '../../../assets/colors';

const LocationRow: React.FC<{
  icon: JSX.Element;
  location: string;
  time: string;
  textStyle?: TextStyle;
  dashThroughIcon?: boolean;
}> = ({icon, location, time, textStyle, dashThroughIcon}) => {
  return (
    <View style={styles.row}>
      <View style={styles.iconLocationContainer}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: !dashThroughIcon
                ? colors.primary.gray
                : 'transparent',
            },
          ]}
        >
          {icon}
        </View>
        <View style={styles.locationContainer}>
          <Text style={[styles.location, textStyle]}>{location}</Text>
        </View>
      </View>
      <View style={styles.timeContainer}>
        <Text style={[styles.time, textStyle]}>{time}</Text>
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
  timeContainer: {flexGrow: 1, alignItems: 'flex-end', marginLeft: 10},
  time: {
    color: colors.general.white,
    fontSize: 12,
  },
});

export default LocationRow;
