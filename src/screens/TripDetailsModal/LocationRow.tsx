import React from 'react';
import {View, Text, TextStyle, StyleProp, ViewStyle} from 'react-native';
import {StyleSheet, useTheme} from '../../theme';

const LocationRow: React.FC<{
  icon: JSX.Element;
  labelIcon?: JSX.Element;
  label: string;
  time?: string;
  aimedTime?: string;
  textStyle?: StyleProp<TextStyle>;
  timeStyle?: StyleProp<TextStyle>;
  rowStyle?: StyleProp<ViewStyle>;
  iconContainerStyle?: StyleProp<ViewStyle>;
  dashThroughIcon?: boolean;
}> = ({
  icon,
  labelIcon,
  label,
  time,
  aimedTime,
  rowStyle,
  textStyle,
  timeStyle,
  iconContainerStyle,
  dashThroughIcon,
}) => {
  const styles = useLocationRowStyle();
  const {theme} = useTheme();

  return (
    <View style={[styles.row, rowStyle]}>
      <View style={styles.iconLocationContainer}>
        <View style={styles.timeContainer}>
          <Text style={[styles.time, textStyle, timeStyle]}>{time}</Text>
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
        <View style={styles.labelContainer}>
          {!!labelIcon && <Text style={styles.labelIcon}>{labelIcon}</Text>}
          <Text style={[styles.label, textStyle]}>{label}</Text>
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
  labelContainer: {
    flexDirection: 'row',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  labelIcon: {
    marginRight: 6,
  },
  label: {
    color: theme.text.colors.primary,
  },
  timeContainer: {
    width: 78,
    alignItems: 'flex-end',
    marginRight: 12,
    justifyContent: 'flex-end',
  },
  time: {
    color: theme.text.colors.primary,
    fontVariant: ['tabular-nums'],
  },
  aimedTime: {
    position: 'absolute',
    top: '50%',
    color: theme.text.colors.primary,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontVariant: ['tabular-nums'],
  },
}));

export default LocationRow;
