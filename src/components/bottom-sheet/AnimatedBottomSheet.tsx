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
    <>
      {/** On Android 15 and later, a black bar was observed at the top
       * when navigating away from the map only after having opened a bottom sheet.
       * The core issue is likely related to the Animated.View below.
       * The fix is to add a view that ensures the whole screen is always painted on. */}
      <View style={styles.alwaysPaintOnEntireScreenToAvoidFlicker} />

      <View
        style={{
          ...styles.bottomSheetContainer,
          bottom: bottomOffset,
          height: windowHeight,
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
    </>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  alwaysPaintOnEntireScreenToAvoidFlicker: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    opacity: 0,
    backgroundColor: 'white',
    pointerEvents: 'box-none',
  },
  bottomSheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    pointerEvents: 'box-none',
  },
  bottomSheet: {
    backgroundColor: getThemeColor(theme).background,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: theme.border.radius.large,
    borderTopRightRadius: theme.border.radius.large,
  },
}));
