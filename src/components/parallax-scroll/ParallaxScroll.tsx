import {StyleSheet} from '@atb/theme';
import {useLayout} from '@atb/utils/use-layout';
import React, {PropsWithChildren, useEffect, useRef} from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControlProps,
  View,
} from 'react-native';

type Props = PropsWithChildren<{
  header: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  handleScroll?: (scrollPercentage: number) => void;
}>;
export function ParallaxScroll({
  header,
  children,
  refreshControl,
  handleScroll,
}: Props) {
  const {onLayout: onHeaderContentLayout, height: contentHeight} = useLayout();
  const contentHeightRef = React.useRef(contentHeight);
  useEffect(() => {
    contentHeightRef.current = contentHeight;
  }, [contentHeight]);

  const styles = useStyles();
  const scrollYRef = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollYRef.interpolate(
    Platform.OS === 'android'
      ? {
          inputRange: [0, contentHeight],
          outputRange: [0, -(contentHeight / 2)],
          extrapolateRight: 'extend',
          extrapolateLeft: 'clamp',
        }
      : {
          inputRange: [-contentHeight, contentHeight],
          outputRange: [0, -contentHeight],
          extrapolateRight: 'extend',
          extrapolateLeft: 'clamp',
        },
  );

  if (refreshControl) {
    refreshControl.props.progressViewOffset = contentHeight;
  }

  const onScroll = Animated.event<NativeScrollEvent>(
    [{nativeEvent: {contentOffset: {y: scrollYRef}}}],
    {
      useNativeDriver: false,
      listener: (ev) => {
        if (handleScroll) {
          handleScroll(
            (ev.nativeEvent?.contentOffset.y / contentHeightRef.current) * 100,
          );
        }
      },
    },
  );

  const childrenProps: ChildrenProps = {
    refreshControl,
    contentHeight,
    children,
    onScroll,
  };

  return (
    <View style={styles.content}>
      {Platform.OS === 'android' ? (
        <ScrollChildrenAndroid {...childrenProps} />
      ) : (
        <ScrollChildrenIOS {...childrenProps} />
      )}

      {/* Header component declared after children to make it render on top of children*/}
      <Animated.View
        style={[styles.header, {transform: [{translateY: headerTranslate}]}]}
      >
        <View onLayout={onHeaderContentLayout}>{header}</View>
      </Animated.View>
    </View>
  );
}

type ChildrenProps = PropsWithChildren<{
  refreshControl: Props['refreshControl'];
  contentHeight: number;
  onScroll: (nativeEvent: NativeSyntheticEvent<NativeScrollEvent>) => void;
}>;

const ScrollChildrenAndroid = ({
  refreshControl,
  children,
  contentHeight,
  onScroll,
}: ChildrenProps) => (
  <Animated.ScrollView
    scrollEventThrottle={10}
    refreshControl={refreshControl}
    onScroll={onScroll}
    contentContainerStyle={{paddingTop: contentHeight}}
  >
    {children}
  </Animated.ScrollView>
);

/*
  On iOS The Animated ScrollView needs the padding applied to a wrapping View
  to be able to work correctly with Voice Over. This can't be done on Android
  since overflow visible is buggy there.
 */
const ScrollChildrenIOS = ({
  refreshControl,
  children,
  contentHeight,
  onScroll,
}: ChildrenProps) => {
  const styles = useStyles();
  return (
    <Animated.ScrollView
      scrollEventThrottle={10}
      refreshControl={refreshControl}
      onScroll={onScroll}
      style={styles.childrenIOS}
      contentInset={{top: contentHeight}}
      contentOffset={{x: 0, y: -contentHeight}}
      automaticallyAdjustContentInsets={false}
    >
      {children}
    </Animated.ScrollView>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  childrenIOS: {overflow: 'visible'},
}));
