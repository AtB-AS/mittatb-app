import {StyleSheet} from '@atb/theme';
import {useLayout} from '@atb/utils/use-layout';
import React, {PropsWithChildren, useCallback, useEffect, useMemo} from 'react';
import {RefreshControl, RefreshControlProps, View} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  ScrollEvent,
} from 'react-native-reanimated';
import {scheduleOnRN} from 'react-native-worklets';

type Props = PropsWithChildren<{
  header: React.ReactNode;
  refreshControlProps?: RefreshControlProps;
  handleScroll?: (scrollPercentage: number) => void;
}>;
export function ParallaxScroll({
  header,
  children,
  refreshControlProps,
  handleScroll,
}: Props) {
  const {onLayout: onHeaderContentLayout, height: headerHeight} = useLayout();
  const contentHeightRef = React.useRef(headerHeight);

  useEffect(() => {
    contentHeightRef.current = headerHeight;
  }, [headerHeight]);

  const styles = useStyles();
  const scrollY = useSharedValue(0);

  const {scrollYInputRange, scrollYOutputRange} = useMemo(() => {
    return {
      scrollYInputRange: [0, headerHeight],
      scrollYOutputRange: [0, -(headerHeight / 2)],
    };
  }, [headerHeight]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            scrollYInputRange,
            scrollYOutputRange,
            {
              extrapolateRight: Extrapolation.EXTEND,
              extrapolateLeft: Extrapolation.CLAMP,
            },
          ),
        },
      ],
    };
  });

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

  const refreshControl = React.useMemo(() => {
    return refreshControlProps ? (
      <RefreshControl
        progressViewOffset={headerHeight}
        {...refreshControlProps}
      />
    ) : undefined;
  }, [refreshControlProps, headerHeight]);

  return (
    <View style={styles.content}>
      <Animated.ScrollView
        scrollEventThrottle={10}
        refreshControl={refreshControl}
        onScroll={onScroll}
        contentContainerStyle={{paddingTop: headerHeight}}
      >
        {children}
      </Animated.ScrollView>

      {/* Header component declared after children to make it render on top of children*/}
      <Animated.View style={[animatedStyles, styles.header]}>
        <View onLayout={onHeaderContentLayout}>{header}</View>
      </Animated.View>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
}));
