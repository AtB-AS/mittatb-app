import {StyleSheet} from '@atb/theme';
import {useLayout} from '@atb/utils/use-layout';
import React, {PropsWithChildren, useCallback, useEffect, useMemo} from 'react';
import {
  Platform,
  RefreshControl,
  RefreshControlProps,
  View,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  ScrollEvent,
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {scheduleOnRN} from 'react-native-worklets';

type Props = PropsWithChildren<{
  header: React.ReactNode;
  headerColor: string;
  refreshControlProps?: RefreshControlProps;
  handleScroll?: (scrollPercentage: number) => void;
}>;
export function ParallaxScroll({
  header,
  headerColor,
  children,
  refreshControlProps,
  handleScroll,
}: Props) {
  const {onLayout: onHeaderContentLayout, height: headerHeight} = useLayout();
  const contentHeightRef = React.useRef(headerHeight);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    contentHeightRef.current = headerHeight;
  }, [headerHeight]);

  const styles = useStyles();

  const handleScrollCallback = useCallback(
    (event: ScrollEvent) => {
      if (handleScroll) {
        handleScroll((event.contentOffset.y / contentHeightRef.current) * 100);
      }
    },
    [handleScroll],
  );

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y;
        scheduleOnRN(handleScrollCallback, event);
      },
    },
    [handleScrollCallback],
  );

  const progressViewOffset = useMemo(() => {
    return Platform.OS === 'android' ? headerHeight : 0;
  }, [headerHeight]);

  const refreshControl = React.useMemo(() => {
    return refreshControlProps ? (
      <RefreshControl
        {...refreshControlProps}
        progressViewOffset={progressViewOffset}
      />
    ) : undefined;
  }, [refreshControlProps, progressViewOffset]);

  const animatedHeaderBackdropStyle = useAnimatedStyle(() => {
    return {
      height: Math.max(0, -scrollY.value + 10),
    };
  });

  const backdropStyle = useMemo(() => {
    return [
      styles.headerBackdrop,
      animatedHeaderBackdropStyle,
      {backgroundColor: headerColor},
    ];
  }, [styles, animatedHeaderBackdropStyle, headerColor]);

  return (
    <View style={styles.content}>
      <Animated.View style={backdropStyle} />
      <Animated.ScrollView
        scrollEventThrottle={10}
        refreshControl={refreshControl}
        onScroll={onScroll}
      >
        <View onLayout={onHeaderContentLayout}>{header}</View>
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  headerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: 2,
  },
}));
