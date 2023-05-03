import {StyleSheet} from '@atb/theme';
import {useLayout} from '@atb/utils/use-layout';
import React, {PropsWithChildren, useEffect, useRef} from 'react';
import {Animated, RefreshControlProps, View} from 'react-native';

type Props = PropsWithChildren<{
  header: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
}>;
export function ParallaxScroll({header, children, refreshControl}: Props) {
  const {onLayout: onHeaderContentLayout, height: contentHeight} = useLayout();
  const contentHeightRef = React.useRef(contentHeight);
  useEffect(() => {
    contentHeightRef.current = contentHeight;
  }, [contentHeight]);

  const styles = useThemeStyles();
  const scrollYRef = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollYRef.interpolate({
    inputRange: [0, contentHeight],
    outputRange: [0, -(contentHeight / 2)],
    extrapolateRight: 'extend',
    extrapolateLeft: 'clamp',
  });

  if (refreshControl) {
    refreshControl.props.progressViewOffset = contentHeight;
  }

  return (
    <View style={styles.content}>
      <Animated.View
        style={[styles.header, {transform: [{translateY: headerTranslate}]}]}
      >
        <View onLayout={onHeaderContentLayout}>{header}</View>
      </Animated.View>

      <Animated.ScrollView
        scrollEventThrottle={10}
        refreshControl={refreshControl}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollYRef}}}],
          {useNativeDriver: false},
        )}
        contentContainerStyle={{paddingTop: contentHeight}}
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
