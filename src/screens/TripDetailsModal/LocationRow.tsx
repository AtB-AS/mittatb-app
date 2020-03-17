import React from 'react';
import {View, Text, TextStyle} from 'react-native';
import colors from '../../theme/colors';
import {StyleSheet} from '../../theme';

const LocationRow: React.FC<{
  icon: JSX.Element;
  location: string;
  time: string;
  textStyle?: TextStyle;
  dashThroughIcon?: boolean;
}> = ({icon, location, time, textStyle, dashThroughIcon}) => {
  const styles = useLocationRowStyle();

  return (
    <View style={styles.row}>
      <View style={styles.iconLocationContainer}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: !dashThroughIcon
                ? colors.general.white
                : 'transparent',
            },
          ]}
        >
          {icon}
        </View>
        <View style={styles.locationContainer}>
          <Text style={[styles.location, textStyle]}>{location}</Text>
        </View>
        <View style={styles.timeContainer}>
          <Text style={[styles.time, textStyle]}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

const useLocationRowStyle = StyleSheet.createThemeHook(theme => ({
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
    color: theme.text.primary,
  },
  timeContainer: {flexGrow: 1, alignItems: 'flex-end', marginLeft: 10},
  time: {
    color: theme.text.primary,
    fontSize: 12,
  },
}));

export default LocationRow;
