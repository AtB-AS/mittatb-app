import {useScrollToTop} from '@react-navigation/native';
import React, {PropsWithChildren, useCallback, useEffect, useRef} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {StyleSheet, useTheme} from '../../theme';
import throttle from '../../utils/throttle';
import {useLayout} from '../../utils/use-layout';

type Props = PropsWithChildren<{
  header: React.ReactNode;
  onRefresh?(): void;
  isRefreshing?: boolean;

  onEndReached?(e: NativeScrollEvent): void;
  onEndReachedThreshold?: number;
}>;

type Scrollable = {
  scrollTo(opts: {y: number}): void;
};

export default function ContentWithDisappearingHeader({
  header,
  children,
  isRefreshing = false,
  onRefresh,

  onEndReached,
  onEndReachedThreshold = 10,
}: Props) {
  const {
    contentHeight,
    onHeaderContentLayout,
  } = useCalculateHeaderContentHeight();
  const contentHeightRef = React.useRef(contentHeight);
  const scrollableContentRef = React.useRef<ScrollView>(null);
  useScrollToTop(
    React.useRef<Scrollable>({
      scrollTo: () =>
        scrollableContentRef.current?.scrollTo({y: contentHeightRef.current}),
    }),
  );

  useEffect(() => {
    contentHeightRef.current = contentHeight;
  }, [contentHeight]);

  const styles = useThemeStyles();
  const {theme} = useTheme();
  const scrollYRef = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollYRef.interpolate({
    inputRange: [-contentHeight, contentHeight],
    outputRange: [0, -contentHeight],
    extrapolate: 'clamp',
  });

  const endReachListener = useCallback(
    throttle((e: NativeScrollEvent) => {
      if (!onEndReached) return;
      if (!isRefreshing && hasReachedEnd(e, onEndReachedThreshold)) {
        onEndReached(e);
      }
    }, 400),
    [isRefreshing, onEndReached, onEndReachedThreshold],
  );

  const onScrolling = useCallback(
    (e: NativeScrollEvent) => {
      endReachListener(e);
    },
    [endReachListener],
  );

  return (
    <View style={styles.content}>
      <Animated.View
        style={[styles.header, {transform: [{translateY: headerTranslate}]}]}
      >
        <View onLayout={onHeaderContentLayout}>{header}</View>
      </Animated.View>

      <Animated.ScrollView
        ref={scrollableContentRef}
        scrollEventThrottle={10}
        refreshControl={
          onRefresh && (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              progressViewOffset={contentHeight}
              tintColor={theme.text.colors.primary}
            />
          )
        }
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollYRef}}}],
          {
            useNativeDriver: true,
            listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
              onScrolling(e.nativeEvent);
            },
          },
        )}
        contentContainerStyle={{
          paddingTop: Platform.OS === 'ios' ? 0 : contentHeight,
        }}
        contentInset={{top: contentHeight}}
        contentOffset={{x: 0, y: -contentHeight}}
        automaticallyAdjustContentInsets={false}
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const hasReachedEnd = (
  {layoutMeasurement, contentOffset, contentSize}: NativeScrollEvent,
  paddingThreshold: number,
) => {
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingThreshold
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  content: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 2,
    elevation: 4,
    justifyContent: 'space-between',
  },
}));

function useCalculateHeaderContentHeight() {
  const {onLayout: onHeaderContentLayout, height: contentHeight} = useLayout();
  return {
    contentHeight,
    onHeaderContentLayout,
  };
}
