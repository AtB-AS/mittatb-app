import {
  Animated,
  LayoutChangeEvent,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {ReactNode, useMemo} from 'react';
import {StyleSheet} from '@atb/theme';
import {BottomSheetTexts, useTranslation} from '@atb/translations';

export default function AnimatedBottomSheet({
  animatedOffset,
  children,
  height,
  onLayout,
}: {
  animatedOffset: Animated.Value;
  children: ReactNode;
  height: number;
  onLayout: (ev: LayoutChangeEvent) => void;
}) {
  const styles = useStyles();
  const translateY = useMemo(
    () =>
      animatedOffset.interpolate({
        inputRange: [0, 1],
        outputRange: [height || -2000, 0],
      }),
    [animatedOffset, height],
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
      }}
      onLayout={onLayout}
    >
      {children}
    </Animated.View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  bottomSheet: {
    backgroundColor: theme.colors.background_2.backgroundColor,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: theme.border.radius.regular,
    borderTopRightRadius: theme.border.radius.regular,
  },
}));
