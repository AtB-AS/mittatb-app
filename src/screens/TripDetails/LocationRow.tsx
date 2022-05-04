import ThemeText from '@atb/components/text';
import {StyleSheet, useTheme} from '@atb/theme';
import React from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

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
  onLayout?: (event: LayoutChangeEvent) => void;
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
  onLayout,
}) => {
  const styles = useLocationRowStyle();
  const {theme} = useTheme();

  return (
    <View style={[styles.row, rowStyle]} onLayout={onLayout}>
      <View style={styles.iconLocationContainer}>
        <View style={styles.timeContainer}>
          <ThemeText style={[styles.time, textStyle, timeStyle]}>
            {time}
          </ThemeText>
          {aimedTime && (
            <ThemeText type="body__tertiary" style={styles.aimedTime}>
              {aimedTime}
            </ThemeText>
          )}
        </View>
        <View
          style={[
            styles.iconContainer,
            iconContainerStyle,
            {
              backgroundColor: !dashThroughIcon
                ? theme.static.background.background_2.background
                : 'transparent',
            },
          ]}
        >
          {icon}
        </View>
        <View style={styles.labelContainer}>
          {!!labelIcon && (
            <ThemeText style={styles.labelIcon}>{labelIcon}</ThemeText>
          )}
          <ThemeText style={textStyle}>{label}</ThemeText>
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
  timeContainer: {
    width: 78,
    alignItems: 'flex-end',
    marginRight: 12,
    justifyContent: 'flex-end',
  },
  time: {
    fontVariant: ['tabular-nums'],
  },
  aimedTime: {
    position: 'absolute',
    top: '50%',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontVariant: ['tabular-nums'],
  },
}));

export default LocationRow;
