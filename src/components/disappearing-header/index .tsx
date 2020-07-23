import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Animated,
  Platform,
  RefreshControl,
  SafeAreaView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import {StyleSheet} from '../../theme';
import useChatIcon from '../../chat/use-chat-icon';
import ScreenHeader from '../../ScreenHeader';
import AnimatedScreenHeader from '../../ScreenHeader/animated-header';

const HEADER_HEIGHT = 157;

type Props = {
  renderHeader(): React.ReactNode;
  onRefresh?(): void;
  headerHeight?: number;
  isRefreshing?: boolean;
  useScroll?: boolean;
  headerTitle: string;
  alternativeTitleComponent?: React.ReactNode;
};

const SCROLL_OFFSET_HEADER_ANIMATION = 80;

const DisappearingHeader: React.FC<Props> = ({
  renderHeader,
  children,
  isRefreshing = false,
  useScroll = true,
  onRefresh,
  headerHeight = HEADER_HEIGHT,

  headerTitle,
  alternativeTitleComponent,
}) => {
  const {icon: chatIcon, openChat} = useChatIcon();
  const [scrollYValue, setScrollY] = useState<number>(0);
  const styles = useThemeStyles();
  const scrollYRef = useRef(
    new Animated.Value(Platform.OS === 'ios' ? -headerHeight : 0),
  ).current;

  const osOffset = Platform.OS === 'ios' ? headerHeight : 0;
  const scrollY = Animated.add(scrollYRef, osOffset);
  const showAltTitle = scrollYValue + osOffset > SCROLL_OFFSET_HEADER_ANIMATION;

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.screen}>
      <AnimatedScreenHeader
        title={headerTitle}
        rightButton={{onPress: openChat, icon: chatIcon}}
        alternativeTitleComponent={alternativeTitleComponent}
        alternativeTitleVisible={showAltTitle}
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.header,
            {transform: [{translateY: headerTranslate}]},
            {height: headerHeight},
          ]}
        >
          {renderHeader()}
        </Animated.View>

        {useScroll ? (
          <Animated.ScrollView
            contentContainerStyle={[
              {paddingTop: Platform.OS !== 'ios' ? headerHeight : 0},
            ]}
            scrollEventThrottle={1}
            style={{flex: 1}}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  progressViewOffset={headerHeight}
                />
              ) : undefined
            }
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollYRef}}}],
              {
                useNativeDriver: true,
                listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                  setScrollY(e.nativeEvent.contentOffset.y);
                },
              },
            )}
            contentInset={{
              top: headerHeight,
            }}
            contentOffset={{
              y: -headerHeight,
            }}
          >
            {children}
          </Animated.ScrollView>
        ) : (
          <View style={{paddingTop: headerHeight}}>{children}</View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default DisappearingHeader;

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  screen: {
    backgroundColor: theme.background.level1,
    paddingBottom: 0,
    flexGrow: 1,
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
  },
  container: {
    backgroundColor: theme.background.level1,
    paddingBottom: 0,
    flexGrow: 1,
  },
}));
