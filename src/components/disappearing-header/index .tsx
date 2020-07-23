import React, {useRef} from 'react';
import {View, Animated, Platform, RefreshControl} from 'react-native';
import {StyleSheet} from '../../theme';

const HEADER_HEIGHT = 157;

type Props = {
  renderHeader(): React.ReactNode;
  onRefresh?(): void;
  headerHeight?: number;
  isRefreshing?: boolean;
  useScroll?: boolean;
};

const DisappearingHeader: React.FC<Props> = ({
  renderHeader,
  children,
  isRefreshing = false,
  useScroll = true,
  onRefresh,
  headerHeight = HEADER_HEIGHT,
}) => {
  const styles = useThemeStyles();
  const scrollYRef = useRef(
    new Animated.Value(Platform.OS === 'ios' ? -headerHeight : 0),
  ).current;

  const scrollY = Animated.add(
    scrollYRef,
    Platform.OS === 'ios' ? headerHeight : 0,
  );
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  return (
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
          bouncesZoom={true}
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
            {useNativeDriver: true},
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
  );
};
export default DisappearingHeader;

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
    elevated: 1,
  },
  container: {
    backgroundColor: theme.background.level1,
    paddingBottom: 0,
    flexGrow: 1,
  },
}));
