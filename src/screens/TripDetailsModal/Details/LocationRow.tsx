import React from 'react';
import {View, Text, TextStyle, StyleProp} from 'react-native';
import {StyleSheet, useTheme} from '../../../theme';

const LocationRow: React.FC<{
  icon: JSX.Element;
  location: string;
  time: string;
  textStyle?: StyleProp<TextStyle>;
  dashThroughIcon?: boolean;
}> = ({icon, location, time, textStyle, dashThroughIcon}) => {
  const styles = useLocationRowStyle();
  const {theme} = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.iconLocationContainer}>
        <View style={styles.timeContainer}>
          <Text style={[styles.time, textStyle]}>{time}</Text>
        </View>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: !dashThroughIcon
                ? theme.background.modal_Level2
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
  timeContainer: {width: 70, alignItems: 'flex-end', marginRight: 12},
  time: {
    color: theme.text.primary,
    fontWeight: 'bold',
  },
}));

export default LocationRow;
