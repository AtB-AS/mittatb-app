import {useScrollToTop} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  AccessibilityProps,
  Animated,
  Easing,
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
import SvgBanner from '../../assets/svg/icons/other/Banner';
import useChatIcon from '../../chat/use-chat-icon';
import AnimatedScreenHeader from '../../ScreenHeader/animated-header';
import LogoOutline from '../../ScreenHeader/LogoOutline';
import {StyleSheet, useTheme} from '../../theme';
import {useLayout} from '../../utils/use-layout';
import ThemeIcon from '../theme-icon';
import useConditionalMemo from '../../utils/use-conditional-memo';
import {useBottomNavigationStyles} from '../../utils/navigation';

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

  logoClick?: {callback(): void} & AccessibilityProps;

  onEndReached?(e: NativeScrollEvent): void;
  onEndReachedThreshold?: number;

  onFullscreenTransitionEnd?(isFullscreen: boolean): void;
};

const SCROLL_OFFSET_HEADER_ANIMATION = 80;

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

  logoClick,

  headerTitle,
  alternativeTitleComponent,

  onEndReached,
  onEndReachedThreshold = 10,
  headerMargin = 12,

  onFullscreenTransitionEnd,
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

  const chatIcon = useChatIcon();
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
  const showAltTitle =
    useScroll && scrollYValue + osOffset > SCROLL_OFFSET_HEADER_ANIMATION;

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
        <AnimatedScreenHeader
          onLayout={onScreenHeaderLayout}
          title={headerTitle}
          rightButton={chatIcon}
          alternativeTitleComponent={alternativeTitleComponent}
          scrollRef={scrollYRef}
          leftButton={{
            onPress: logoClick?.callback,
            icon: <ThemeIcon svg={LogoOutline} />,
            ...logoClick,
          }}
        />

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.header,
              {transform: [{translateY: headerTranslate}]},
              {height: boxHeight},
            ]}
          >
            <View style={styles.bannerContainer}>
              <SvgBanner
                width={windowWidth}
                height={windowWidth / 2}
                opacity={0.6}
              />
            </View>

            <ScrollView style={styles.highlightComponent}>
              {highlightComponent}
            </ScrollView>

            <View onLayout={onHeaderContentLayout}>
              {renderHeader(fullheightTransitioned, isAnimating)}
            </View>
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
                  tintColor={theme.text.colors.primary}
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
    backgroundColor: theme.background.level1,
    flexGrow: 1,
  },
  topBorder: {
    backgroundColor: theme.background.header,
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
    backgroundColor: theme.background.header,
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: theme.background.level1,
    paddingBottom: 0,
    flexGrow: 1,
  },
}));

const throttle = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
) => {
  const now = () => new Date().getTime();
  const resetStartTime = () => (startTime = now());
  let timeout: NodeJS.Timeout;
  let startTime: number = now() - waitFor;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      const timeLeft = startTime + waitFor - now();
      if (timeout) {
        clearTimeout(timeout);
      }
      if (startTime + waitFor <= now()) {
        resetStartTime();
        resolve(func(...args));
      } else {
        timeout = setTimeout(() => {
          resetStartTime();
          resolve(func(...args));
        }, timeLeft);
      }
    });
};

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
