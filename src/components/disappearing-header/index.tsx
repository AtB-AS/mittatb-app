import GlobalMessageBox from '@atb/global-messages/GlobalMessage';
import {GlobalMessageContext} from '@atb/global-messages/GlobalMessagesContext';
import {
  AnimatedScreenHeader,
  LeftButtonProps,
} from '@atb/components/screen-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {useBottomNavigationStyles} from '@atb/utils/navigation';
import throttle from '@atb/utils/throttle';
import useConditionalMemo from '@atb/utils/use-conditional-memo';
import {useLayout} from '@atb/utils/use-layout';
import {NavigationProp, useScrollToTop} from '@react-navigation/native';
import hexToRgba from 'hex-to-rgba';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  useSafeAreaFrame,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

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

  leftButton?: LeftButtonProps;

  tabPressBehaviour?: {
    navigation: NavigationProp<any>;
    onTabPressOnTopScroll: () => void;
  };

  useScroll?: boolean;
  headerTitle: React.ReactNode;
  alternativeTitleComponent?: React.ReactNode;
  showAlterntativeTitle?: Boolean;

  onEndReached?(e: NativeScrollEvent): void;
  onEndReachedThreshold?: number;

  onFullscreenTransitionEnd?(isFullscreen: boolean): void;

  /**
   * For specifying the alert context for alerts that should be shown in this
   * header. If no context is specified then no alerts are shown.
   */
  globalMessageContext?: GlobalMessageContext;
};

const SCROLLED_TOP_THRESHOLD = 30;

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

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

  tabPressBehaviour,

  headerTitle,
  alternativeTitleComponent,
  showAlterntativeTitle,

  onEndReached,
  onEndReachedThreshold = 10,

  onFullscreenTransitionEnd,
  globalMessageContext,
}) => {
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [fullheightTransitioned, setTransitioned] = useState(isFullHeight);
  const {
    boxHeight,
    contentHeight,
    contentOffset,
    onScreenHeaderLayout,
    onHeaderContentLayout,
  } = useCalculateHeaderContentHeight(isAnimating);
  const scrollableContentRef = React.useRef<ScrollView>(null);
  const scrollYValue = useRef(0);

  useScrollToTop(
    React.useRef<Scrollable>({
      scrollTo: () =>
        scrollableContentRef.current?.scrollTo({y: -contentOffset}),
    }),
  );

  const styles = useThemeStyles();
  const {theme} = useTheme();
  const scrollYRef = useRef(
    new Animated.Value(IS_IOS ? -contentOffset : 0),
  ).current;

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
      duration: 800,
      easing: Easing.out(Easing.exp),
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
      scrollYValue.current = scrollPos;
      endReachListener(e);
    },
    [endReachListener, scrollYValue],
  );

  useEffect(() => {
    if (!tabPressBehaviour) return;
    const {navigation, onTabPressOnTopScroll} = tabPressBehaviour;

    const unsubscribe = navigation
      .dangerouslyGetParent()
      // Typescript doesn't know that tabLongPress exist in the parent
      // and types aren't properly exposed to compensate for that.
      ?.addListener('tabPress' as any, () => {
        if (!navigation.isFocused()) return;
        if (!isScrolledToTop(scrollYValue.current, contentHeight)) return;
        onTabPressOnTopScroll();
      });

    return unsubscribe;
  }, [
    tabPressBehaviour?.navigation,
    tabPressBehaviour?.onTabPressOnTopScroll,
    scrollYValue,
    contentHeight,
  ]);

  return (
    <>
      <View style={[styles.topBorder, screenTopStyle]} />
      <View style={styles.screen}>
        <View onLayout={onScreenHeaderLayout}>
          <AnimatedScreenHeader
            title={headerTitle}
            rightButton={{type: 'chat', color: themeColor, testID: 'rhb'}}
            alternativeTitleComponent={alternativeTitleComponent}
            showAlternativeTitle={showAlterntativeTitle && !isAnimating}
            scrollRef={scrollYRef}
            leftButton={leftButton}
          />

          <View style={styles.globalMessageBoxContainer}>
            <GlobalMessageBox
              globalMessageContext={globalMessageContext}
              style={styles.globalMessageBox}
            />
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
              source={require('../../../assets/design-assets/colors/images/PhotoBackground.jpg')}
              style={styles.backgroundImage}
            >
              <View style={{flex: 1}}>
                <LinearGradient
                  style={styles.backgroundImageGradient}
                  colors={[
                    'transparent',
                    'transparent',
                    'transparent',
                    hexToRgba(
                      theme.static.background.background_accent_0.background,
                      1,
                    ),
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
                  tintColor={theme.text.colors.secondary}
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
              automaticallyAdjustContentInsets={false}
              contentInset={{
                top: contentHeight,
              }}
              contentOffset={{
                y: -contentHeight,
                x: 0,
              }}
            >
              {children}
            </Animated.ScrollView>
          ) : (
            <View style={{flex: 1, paddingTop: contentHeight}}>{children}</View>
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
    backgroundColor: theme.static.background.background_1.background,
    flexGrow: 1,
  },
  globalMessageBoxContainer: {
    backgroundColor: theme.static.background[themeColor].background,
  },
  globalMessageBox: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  topBorder: {
    backgroundColor: theme.static.background[themeColor].background,
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
    backgroundColor: theme.static.background[themeColor].background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 2,
    elevated: 1,
    backgroundColor: theme.static.background[themeColor].background,
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: theme.static.background[themeColor].background,
    paddingBottom: 0,
    flexGrow: 1,
  },
}));

function isScrolledToTop(scrollPosition: number, contentHeightOffset: number) {
  const offset = Platform.OS === 'ios' ? -contentHeightOffset : 0;
  return scrollPosition <= offset + SCROLLED_TOP_THRESHOLD;
}

function useCalculateHeaderContentHeight(isAnimating: boolean) {
  // Using safeAreaFrame for height instead of dimensions as
  // dimensions are problamatic on Android: https://github.com/facebook/react-native/issues/23693
  const {height: actualHeight} = useSafeAreaFrame();
  const {onLayout: onScreenHeaderLayout, height: screenHeaderHeight} =
    useLayout();
  const {onLayout: onHeaderContentLayout, height: contentHeight} = useLayout();
  const {top} = useSafeAreaInsets();

  const {minHeight: bottomTabBarHeight} = useBottomNavigationStyles();
  const boxHeight = Math.ceil(
    actualHeight - screenHeaderHeight - top - bottomTabBarHeight,
  );

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
