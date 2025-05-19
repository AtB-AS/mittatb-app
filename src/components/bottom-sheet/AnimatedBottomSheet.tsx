import {
  Animated,
  LayoutChangeEvent,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {ReactNode, useMemo} from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {shadows} from '@atb/modules/map';

const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];

export function AnimatedBottomSheet({
  animatedOffset,
  children,
  onLayout,
  bottomOffset = 0,
}: {
  animatedOffset: Animated.Value;
  children: ReactNode;
  bottomOffset?: number;
  onLayout: (ev: LayoutChangeEvent) => void;
}) {
  const styles = useStyles();
  const {height: windowHeight} = useWindowDimensions();
  const translateY = useMemo(
    () =>
      animatedOffset.interpolate({
        inputRange: [0, 1],
        outputRange: [windowHeight + bottomOffset, 0],
        extrapolate: 'clamp',
      }),
    [animatedOffset, bottomOffset, windowHeight],
  );
  return (
    <View
      style={{
        position: 'absolute',
        bottom: bottomOffset,
        left: 0,
        right: 0,
        height: windowHeight,
        overflow: 'hidden',
        pointerEvents: 'box-none',
      }}
    >
      <Animated.View
        style={{
          ...styles.bottomSheet,
          transform: [{translateY}],
          maxHeight: windowHeight,
          ...shadows,
        }}
        onLayout={onLayout}
      >
        {children}
      </Animated.View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  bottomSheet: {
    backgroundColor: getThemeColor(theme).background,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: theme.border.radius.large,
    borderTopRightRadius: theme.border.radius.large,
  },
}));
