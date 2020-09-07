import {useScrollToTop} from '@react-navigation/native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeArea} from 'react-native-safe-area-context';
import useChatIcon from '../../chat/use-chat-icon';
import AnimatedScreenHeader from '../../ScreenHeader/animated-header';
import {StyleSheet} from '../../theme';
import {useLayout} from '../../utils/use-layout';
import SvgBanner from '../../assets/svg/icons/other/Banner';

type Props = {
  renderHeader(): React.ReactNode;
  onRefresh?(): void;
  headerHeight?: number;
  isRefreshing?: boolean;
  isFullHeight?: boolean;

  useScroll?: boolean;
  headerTitle: string;
  alternativeTitleComponent?: React.ReactNode;

  headerMargin?: number;

  onLogoClick?(): void;

  onEndReached?(e: NativeScrollEvent): void;
  onEndReachedThreshold?: number;
};

const SCROLL_OFFSET_HEADER_ANIMATION = 80;

type Scrollable = {
  scrollTo(opts: {y: number}): void;
};

const IS_IOS = Platform.OS === 'ios';

const DisappearingHeader: React.FC<Props> = ({
  renderHeader,
  children,
  isRefreshing = false,
  useScroll = true,
  onRefresh,

  isFullHeight = false,

  onLogoClick,

  headerTitle,
  alternativeTitleComponent,

  onEndReached,
  onEndReachedThreshold = 10,
  headerMargin = 12,
}) => {
  const {
    boxHeight,
    contentHeight,
    contentOffset,
    onScreenHeaderLayout,
    onHeaderContentLayout,
  } = useCalculateHeaderContentHeight();

  const {width: windowWidth} = useWindowDimensions();
  const scrollableContentRef = React.useRef<ScrollView>(null);
  useScrollToTop(
    React.useRef<Scrollable>({
      scrollTo: () =>
        scrollableContentRef.current?.scrollTo({y: -contentOffset}),
    }),
  );

  const {icon: chatIcon, openChat} = useChatIcon();
  const [scrollYValue, setScrollY] = useState<number>(0);
  const styles = useThemeStyles();
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

  useEffect(
    () =>
      Animated.timing(fullscreenOffsetRef, {
        toValue: isFullHeight ? 0 : contentOffset,
        duration: 400,
        useNativeDriver: true,
      }).start(),
    [isFullHeight],
  );

  useEffect(
    () => fullscreenOffsetRef.setValue(isFullHeight ? 0 : contentOffset),
    [contentOffset],
  );

  const osOffset = IS_IOS ? contentHeight : 0;
  const scrollY = Animated.add(scrollYRef, osOffset);
  const showAltTitle =
    useScroll && scrollYValue + osOffset > SCROLL_OFFSET_HEADER_ANIMATION;

  const headerTranslate = Animated.subtract(
    scrollY.interpolate({
      inputRange: [0, contentHeight],
      outputRange: [0, -contentHeight],
      extrapolate: 'clamp',
    }),
    fullscreenOffsetRef,
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
      <SafeAreaView style={styles.topBorder} />
      <View style={styles.screen}>
        <AnimatedScreenHeader
          onLayout={onScreenHeaderLayout}
          title={headerTitle}
          rightButton={{onPress: openChat, icon: chatIcon}}
          alternativeTitleComponent={alternativeTitleComponent}
          alternativeTitleVisible={showAltTitle}
          onLogoClick={onLogoClick}
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
              <SvgBanner width={windowWidth} height={windowWidth / 2} />
            </View>

            <View style={styles.header__inner} onLayout={onHeaderContentLayout}>
              {renderHeader()}
            </View>
          </Animated.View>

          {useScroll ? (
            <Animated.ScrollView
              ref={scrollableContentRef}
              contentContainerStyle={[
                {paddingTop: !IS_IOS ? contentHeight : 0},
              ]}
              scrollEventThrottle={10}
              style={{flex: 1}}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  progressViewOffset={contentHeight}
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
              contentInset={{
                top: contentHeight + headerMargin,
              }}
              contentOffset={{
                y: -contentHeight - headerMargin,
              }}
            >
              {children}
            </Animated.ScrollView>
          ) : (
            <View style={{paddingTop: contentHeight + headerMargin}}>
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
    flex: 0,
    backgroundColor: theme.background.accent,
  },
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
    backgroundColor: theme.background.accent,
    justifyContent: 'flex-end',
  },
  header__inner: {
    paddingBottom: 10,
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

// This is code from react-navigation. Couldn't find any
// way to reasonably calculate this.
const DEFAULT_TABBAR_HEIGHT = 49;

function useCalculateHeaderContentHeight() {
  const {height: windowHeight} = useWindowDimensions();
  const {
    onLayout: onScreenHeaderLayout,
    height: screenHeaderHeight,
  } = useLayout();
  const {onLayout: onHeaderContentLayout, height: contentHeight} = useLayout();
  const {top, bottom} = useSafeArea();

  // Calculate padding of tabbar. Adjusted code from react-navigation
  // component.
  const tabBarPadding = Math.max(
    Platform.select({ios: bottom - 10, default: DEFAULT_TABBAR_HEIGHT}),
    0,
  );

  const boxHeight =
    windowHeight -
    screenHeaderHeight -
    top -
    bottom -
    DEFAULT_TABBAR_HEIGHT -
    tabBarPadding;

  return {
    boxHeight,
    contentHeight,
    contentOffset: boxHeight - contentHeight,
    onScreenHeaderLayout,
    onHeaderContentLayout,
  };
}
