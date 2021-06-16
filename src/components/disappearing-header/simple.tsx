import {StyleSheet, useTheme} from '@atb/theme';
import throttle from '@atb/utils/throttle';
import {useLayout} from '@atb/utils/use-layout';
import {useScrollToTop} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  AnimatedScreenHeader,
  LeftButtonProps,
} from '@atb/components/screen-header';
import {AlertContext} from '@atb/alerts/AlertsContext';
import AlertBox from '@atb/alerts/AlertBox';
import {ThemeColor} from '@atb/theme/colors';

const themeColor: ThemeColor = 'background_gray';

type Props = {
  header: React.ReactNode;
  onRefresh?(): void;
  headerHeight?: number;
  isRefreshing?: boolean;
  isFullHeight?: boolean;

  useScroll?: boolean;
  headerTitle: React.ReactNode;
  alternativeTitleComponent?: React.ReactNode;

  headerMargin?: number;

  leftButton: LeftButtonProps;

  onEndReached?(e: NativeScrollEvent): void;
  onEndReachedThreshold?: number;

  setFocusOnLoad?: boolean;

  /**
   * For specifying the alert context for alerts that should be shown in this
   * header. If no context is specified then no alerts are shown.
   */
  alertContext?: AlertContext;
};

type Scrollable = {
  scrollTo(opts: {y: number}): void;
};

const SimpleDisappearingHeader: React.FC<Props> = ({
  header,
  children,
  isRefreshing = false,
  onRefresh,

  leftButton,

  headerTitle,
  alternativeTitleComponent,

  onEndReached,
  onEndReachedThreshold = 10,

  setFocusOnLoad,

  alertContext,
}) => {
  const {
    contentHeight,
    onScreenHeaderLayout,
    onHeaderContentLayout,
  } = useCalculateHeaderContentHeight();
  const contentHeightRef = React.useRef(contentHeight);
  const scrollableContentRef = React.useRef<ScrollView>(null);
  useScrollToTop(
    React.useRef<Scrollable>({
      scrollTo: () =>
        scrollableContentRef.current?.scrollTo({y: -contentHeightRef.current}),
    }),
  );

  useEffect(() => {
    contentHeightRef.current = contentHeight;
  }, [contentHeight]);

  const styles = useThemeStyles();
  const {theme} = useTheme();
  const scrollYRef = useRef(new Animated.Value(0)).current;
  const nullRef = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollYRef.interpolate({
    inputRange: [0, contentHeight],
    outputRange: [0, -contentHeight],
    extrapolate: 'clamp',
  });

  const {top} = useSafeAreaInsets();
  const screenTopStyle = useMemo(
    () => ({
      paddingTop: top,
    }),
    [top],
  );

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
    <>
      <View style={[styles.topBorder, screenTopStyle]} />
      <View style={styles.screen}>
        <View onLayout={onScreenHeaderLayout}>
          <AnimatedScreenHeader
            title={headerTitle}
            rightButton={{type: 'chat', color: themeColor}}
            alternativeTitleComponent={alternativeTitleComponent}
            scrollRef={isRefreshing ? nullRef : scrollYRef}
            leftButton={leftButton}
            setFocusOnLoad={setFocusOnLoad}
          />
          <View style={styles.alertBoxContainer}>
            <AlertBox alertContext={alertContext} style={styles.alertBox} />
          </View>
        </View>

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.header,
              {transform: [{translateY: headerTranslate}]},
            ]}
          >
            <View onLayout={onHeaderContentLayout}>{header}</View>
          </Animated.View>

          <Animated.ScrollView
            ref={scrollableContentRef}
            scrollEventThrottle={10}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                progressViewOffset={contentHeight}
                tintColor={theme.text.colors.primary}
              />
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
      </View>
    </>
  );
};
export default SimpleDisappearingHeader;

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
  screen: {
    backgroundColor: theme.colors.background_1.backgroundColor,
    flexGrow: 1,
  },
  alertBoxContainer: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
  },
  alertBox: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  topBorder: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
  },

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
    elevated: 1,
    backgroundColor: theme.colors[themeColor].backgroundColor,
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
    paddingBottom: 0,
    flexGrow: 1,
  },
}));

function useCalculateHeaderContentHeight() {
  const {onLayout: onScreenHeaderLayout} = useLayout();
  const {onLayout: onHeaderContentLayout, height: contentHeight} = useLayout();

  return {
    contentHeight,
    onScreenHeaderLayout,
    onHeaderContentLayout,
  };
}
