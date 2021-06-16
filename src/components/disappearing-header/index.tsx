import SvgBanner from '@atb/assets/svg/icons/other/Banner';
import {StyleSheet, useTheme} from '@atb/theme';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import throttle from '@atb/utils/throttle';
import useConditionalMemo from '@atb/utils/use-conditional-memo';
import {useLayout} from '@atb/utils/use-layout';
import {useScrollToTop} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  AnimatedScreenHeader,
  LeftButtonProps,
} from '@atb/components/screen-header';
import {AlertContext} from '@atb/alerts/AlertsContext';
import AlertBox from '@atb/alerts/AlertBox';
import {ThemeColor} from '@atb/theme/colors';
import LinearGradient from 'react-native-linear-gradient';
import hexToRgba from 'hex-to-rgba';

type Props = {
  renderHeader(
    isFullHeight: boolean,
    isParentAnimating: boolean,
  ): React.ReactNode;
  highlightComponent?: React.ReactNode;
  onRefresh?(): void;
  headerHeight?: number;
  isRefreshing?: boolean;
  isFullHeight?: boolean;

  useScroll?: boolean;
  headerTitle: React.ReactNode;
  alternativeTitleComponent?: React.ReactNode;

  headerMargin?: number;

  leftButton?: LeftButtonProps;

  onEndReached?(e: NativeScrollEvent): void;
  onEndReachedThreshold?: number;

  onFullscreenTransitionEnd?(isFullscreen: boolean): void;

  /**
   * For specifying the alert context for alerts that should be shown in this
   * header. If no context is specified then no alerts are shown.
   */
  alertContext?: AlertContext;
};

const SCROLL_OFFSET_HEADER_ANIMATION = 80;
const themeColor: ThemeColor = 'background_gray';

type Scrollable = {
  scrollTo(opts: {y: number}): void;
};

const IS_IOS = Platform.OS === 'ios';

const DisappearingHeader: React.FC<Props> = ({
  renderHeader,
  highlightComponent,
  children,
  isRefreshing = false,
  useScroll = true,
  onRefresh,

  isFullHeight = false,

  leftButton,

  headerTitle,
  alternativeTitleComponent,

  onEndReached,
  onEndReachedThreshold = 10,
  headerMargin = 12,

  onFullscreenTransitionEnd,
  alertContext,
}) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const {
    boxHeight,
    contentHeight,
    contentOffset,
    onScreenHeaderLayout,
    onHeaderContentLayout,
  } = useCalculateHeaderContentHeight(isAnimating);
  const [fullheightTransitioned, setTransitioned] = useState(isFullHeight);
  const {width: windowWidth} = useWindowDimensions();
  const scrollableContentRef = React.useRef<ScrollView>(null);
  useScrollToTop(
    React.useRef<Scrollable>({
      scrollTo: () =>
        scrollableContentRef.current?.scrollTo({y: -contentOffset}),
    }),
  );

  const [scrollYValue, setScrollY] = useState<number>(0);
  const styles = useThemeStyles();
  const {theme} = useTheme();
  const scrollYRef = useRef(new Animated.Value(IS_IOS ? -contentOffset : 0))
    .current;

  const fullscreenOffsetRef = useRef(
    new Animated.Value(isFullHeight ? 0 : contentOffset),
  ).current;

  useEffect(
    function () {
      if (IS_IOS) {
        scrollYRef.setValue(-contentHeight);
      }
    },
    [contentHeight, contentOffset],
  );

  useEffect(() => {
    setIsAnimating(true);
    Animated.timing(fullscreenOffsetRef, {
      toValue: isFullHeight ? 0 : contentOffset,
      duration: 400,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(function () {
      setIsAnimating(false);
      setTransitioned(isFullHeight);
      onFullscreenTransitionEnd?.(isFullHeight);
    });
  }, [isFullHeight]);

  useEffect(
    () => fullscreenOffsetRef.setValue(isFullHeight ? 0 : contentOffset),
    [contentOffset],
  );

  const osOffset = IS_IOS ? contentHeight : 0;
  const scrollY = Animated.add(scrollYRef, osOffset);

  const headerTranslate = Animated.subtract(
    isFullHeight
      ? 0
      : scrollY.interpolate({
          inputRange: [0, contentHeight],
          outputRange: [0, -contentHeight],
          extrapolate: 'clamp',
        }),
    fullscreenOffsetRef,
  );

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
      const scrollPos = e.contentOffset.y;
      setScrollY(scrollPos);
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
            scrollRef={scrollYRef}
            leftButton={leftButton}
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
              {height: boxHeight},
            ]}
          >
            <ImageBackground
              source={require('../../../assets/assistant_background.jpeg')}
              style={styles.backgroundImage}
            >
              <View style={{flex: 1}}>
                <LinearGradient
                  style={styles.backgroundImageGradient}
                  colors={[
                    'transparent',
                    'transparent',
                    'transparent',
                    hexToRgba(theme.colors.background_gray.backgroundColor, 1),
                  ]}
                />
                <ScrollView style={styles.highlightComponent}>
                  {highlightComponent}
                </ScrollView>
              </View>

              <View
                onLayout={onHeaderContentLayout}
                style={styles.headerContent}
              >
                {renderHeader(fullheightTransitioned, isAnimating)}
              </View>
            </ImageBackground>
          </Animated.View>

          {useScroll ? (
            <Animated.ScrollView
              ref={scrollableContentRef}
              scrollEventThrottle={10}
              style={{flex: 1}}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  progressViewOffset={contentHeight}
                  tintColor={theme.colors[themeColor].color}
                />
              }
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {y: scrollYRef}}}],
                {
                  // For some reason native driver true her (which is preffered)
                  // causes the content animation to jump when refresh control
                  // is triggered. Not ideal having native driver false
                  // but for now this is the best I can do. -mb
                  useNativeDriver: !IS_IOS,
                  listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                    onScrolling(e.nativeEvent);
                  },
                },
              )}
              contentContainerStyle={[
                {paddingTop: !IS_IOS ? contentHeight : 0},
              ]}
              contentInset={{
                top: contentHeight + headerMargin,
              }}
              contentOffset={{
                y: -contentHeight - headerMargin,
                x: 0,
              }}
            >
              {children}
            </Animated.ScrollView>
          ) : (
            <View style={{flex: 1, paddingTop: contentHeight + headerMargin}}>
              {children}
            </View>
          )}
        </View>
      </View>
    </>
  );
};
export default DisappearingHeader;

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
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },

  highlightComponent: {
    margin: theme.spacings.medium,
  },

  backgroundImage: {height: '100%'},

  backgroundImageGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },

  content: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  headerContent: {
    backgroundColor: theme.colors[themeColor].backgroundColor,
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

function useCalculateHeaderContentHeight(isAnimating: boolean) {
  // Using safeAreaFrame for height instead of dimensions as
  // dimensions are problamatic on Android: https://github.com/facebook/react-native/issues/23693
  const {height: actualHeight} = useSafeAreaFrame();
  const {
    onLayout: onScreenHeaderLayout,
    height: screenHeaderHeight,
  } = useLayout();
  const {onLayout: onHeaderContentLayout, height: contentHeight} = useLayout();
  const {top} = useSafeAreaInsets();

  const {minHeight: bottomTabBarHeight} = useBottomNavigationStyles();
  const boxHeight =
    actualHeight - screenHeaderHeight - top - bottomTabBarHeight;

  const calculatedHeights = {
    boxHeight,
    contentHeight,
    contentOffset: boxHeight - contentHeight,
    onScreenHeaderLayout,
    onHeaderContentLayout,
  };

  return useConditionalMemo(
    () => calculatedHeights,
    () => !isAnimating,
    calculatedHeights,
    [isAnimating],
  );
}
