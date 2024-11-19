import {Animated, LayoutChangeEvent, useWindowDimensions} from 'react-native';
import React, {ReactNode, useMemo} from 'react';
import {StyleSheet, Theme} from '@atb/theme';

const getThemeColor = (theme: Theme) => theme.color.background.neutral[1];

export function AnimatedBottomSheet({
  animatedOffset,
  children,
  onLayout,
}: {
  animatedOffset: Animated.Value;
  children: ReactNode;
  onLayout: (ev: LayoutChangeEvent) => void;
}) {
  const styles = useStyles();
  const {height: windowHeight} = useWindowDimensions();
  const translateY = useMemo(
    () =>
      animatedOffset.interpolate({
        inputRange: [0, 1],
        outputRange: [windowHeight, 0],
      }),
    [animatedOffset, windowHeight],
  );
  return (
    <Animated.View
      style={{
        ...styles.bottomSheet,
        transform: [
          {
            translateY,
          },
        ],
        maxHeight: windowHeight,
      }}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  bottomSheet: {
    backgroundColor: getThemeColor(theme).background,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: theme.border.radius.circle,
    borderTopRightRadius: theme.border.radius.circle,
  },
}));
