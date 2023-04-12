import {StyleSheet, useTheme} from '@atb/theme';
import {useLayout} from '@atb/utils/use-layout';
import React, {PropsWithChildren, useEffect, useRef} from 'react';
import {Animated, Platform, RefreshControl, View} from 'react-native';

export type ContentWithDisappearingHeaderProps = PropsWithChildren<{
  header: React.ReactNode;
  onRefresh?(): void;
  isRefreshing?: boolean;
}>;
export function ContentWithDisappearingHeader({
  header,
  children,
  isRefreshing = false,
  onRefresh,
}: ContentWithDisappearingHeaderProps) {
  const {onLayout: onHeaderContentLayout, height: contentHeight} = useLayout();
  const contentHeightRef = React.useRef(contentHeight);
  useEffect(() => {
    contentHeightRef.current = contentHeight;
  }, [contentHeight]);

  const styles = useThemeStyles();
  const {theme} = useTheme();
  const scrollYRef = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollYRef.interpolate({
    // iOS and Android behaves differently here, so to match scrolling half speed
    // there are two different ways to do it.
    inputRange: [Platform.OS === 'ios' ? -contentHeight : 0, contentHeight],
    outputRange: [0, -(contentHeight / (Platform.OS === 'ios' ? 1 : 2))],
    extrapolateRight: 'extend',
    extrapolateLeft: 'clamp',
  });

  return (
    <View style={styles.content}>
      <Animated.View
        style={[styles.header, {transform: [{translateY: headerTranslate}]}]}
      >
        <View onLayout={onHeaderContentLayout}>{header}</View>
      </Animated.View>

      <Animated.ScrollView
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
          {useNativeDriver: false},
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

const useThemeStyles = StyleSheet.createThemeHook(() => ({
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
