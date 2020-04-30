import React from 'react';
import {View, Text, TextStyle, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, useTheme} from '../../theme';

const LocationRow: React.FC<{
  icon: JSX.Element;
  location: string;
  time?: string;
  aimedTime?: string;
  textStyle?: StyleProp<TextStyle>;
  rowStyle?: StyleProp<ViewStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  dashThroughIcon?: boolean;
}> = ({
  icon,
  location,
  time,
  aimedTime,
  rowStyle,
  textStyle,
  iconContainerStyle,
  dashThroughIcon,
}) => {
  const styles = useLocationRowStyle();
  const {theme} = useTheme();

  return (
    <View style={[styles.row, rowStyle]}>
      <View style={styles.iconLocationContainer}>
        <View style={styles.timeContainer}>
          <Text style={[styles.time, textStyle]}>{time}</Text>
          {aimedTime && <Text style={styles.aimedTime}>{aimedTime}</Text>}
        </View>
        <View
          style={[
            styles.iconContainer,
            iconContainerStyle,
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

const useLocationRowStyle = StyleSheet.createThemeHook((theme) => ({
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
  timeContainer: {
    width: 70,
    alignItems: 'flex-end',
    marginRight: 12,
    justifyContent: 'flex-end',
  },
  time: {
    color: theme.text.primary,
    fontWeight: 'bold',
    fontVariant: ['tabular-nums'],
  },
  aimedTime: {
    position: 'absolute',
    top: '50%',
    color: theme.text.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontVariant: ['tabular-nums'],
  },
}));

export default LocationRow;
