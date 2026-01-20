import {StyleSheet} from '@atb/theme';
import {useLayout} from '@atb/utils/use-layout';
import React, {PropsWithChildren, useCallback, useEffect, useMemo} from 'react';
import {Platform, RefreshControlProps, View} from 'react-native';
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
  refreshControl?: React.ReactElement<RefreshControlProps>;
  handleScroll?: (scrollPercentage: number) => void;
}>;
export function ParallaxScroll({
  header,
  children,
  refreshControl,
  handleScroll,
}: Props) {
  const {onLayout: onHeaderContentLayout, height: contentHeight} = useLayout();
  const contentHeightRef = React.useRef(contentHeight);
  useEffect(() => {
    contentHeightRef.current = contentHeight;
  }, [contentHeight]);

  const styles = useStyles();
  const scrollY = useSharedValue(0);

  const {scrollYInputRange, scrollYOutputRange} = useMemo(() => {
    return Platform.select({
      android: {
        scrollYInputRange: [0, contentHeight],
        scrollYOutputRange: [0, -(contentHeight / 2)],
      },
      default: {
        scrollYInputRange: [-contentHeight, contentHeight],
        scrollYOutputRange: [0, -contentHeight],
      },
    });
  }, [contentHeight]);

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

  // clone the refreshControl to avoid mutating the original prop
  const clonedRefreshControl = refreshControl
    ? React.cloneElement(refreshControl, {
        ...refreshControl.props,
        progressViewOffset: contentHeight,
      })
    : undefined;

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

  const childrenProps: ChildrenProps = {
    refreshControl: clonedRefreshControl,
    contentHeight,
    children,
    onScroll,
  };

  return (
    <View style={styles.content}>
      {Platform.OS === 'android' ? (
        <ScrollChildrenAndroid {...childrenProps} />
      ) : (
        <ScrollChildrenIOS {...childrenProps} />
      )}

      {/* Header component declared after children to make it render on top of children*/}
      <Animated.View style={[animatedStyles, styles.header]}>
        <View onLayout={onHeaderContentLayout}>{header}</View>
      </Animated.View>
    </View>
  );
}

type ChildrenProps = PropsWithChildren<{
  refreshControl: Props['refreshControl'];
  contentHeight: number;
  onScroll: ReturnType<typeof useAnimatedScrollHandler>;
}>;

const ScrollChildrenAndroid = ({
  refreshControl,
  children,
  contentHeight,
  onScroll,
}: ChildrenProps) => (
  <Animated.ScrollView
    scrollEventThrottle={10}
    refreshControl={refreshControl}
    onScroll={onScroll}
    contentContainerStyle={{paddingTop: contentHeight}}
  >
    {children}
  </Animated.ScrollView>
);

/*
  On iOS The Animated ScrollView needs the padding applied to a wrapping View
  to be able to work correctly with Voice Over. This can't be done on Android
  since overflow visible is buggy there.
 */
const ScrollChildrenIOS = ({
  refreshControl,
  children,
  contentHeight,
  onScroll,
}: ChildrenProps) => {
  const styles = useStyles();
  return (
    <Animated.ScrollView
      scrollEventThrottle={10}
      refreshControl={refreshControl}
      onScroll={onScroll}
      style={styles.childrenIOS}
      contentInset={{top: contentHeight}}
      contentOffset={{x: 0, y: -contentHeight}}
      automaticallyAdjustContentInsets={false}
    >
      {children}
    </Animated.ScrollView>
  );
};

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
  childrenIOS: {},
}));
