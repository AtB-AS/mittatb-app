import {StyleSheet} from '@atb/theme';
import {useLayout} from '@atb/utils/use-layout';
import React, {PropsWithChildren, useCallback, useEffect} from 'react';
import {RefreshControl, RefreshControlProps, View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  ScrollEvent,
} from 'react-native-reanimated';
import {scheduleOnRN} from 'react-native-worklets';

type Props = PropsWithChildren<{
  header: React.ReactNode;
  refreshControlProps?: RefreshControlProps;
  handleScroll?: (scrollPercentage: number) => void;
}>;
export function ParallaxScroll({
  header,
  children,
  refreshControlProps,
  handleScroll,
}: Props) {
  const {onLayout: onHeaderContentLayout, height: headerHeight} = useLayout();
  const contentHeightRef = React.useRef(headerHeight);

  useEffect(() => {
    contentHeightRef.current = headerHeight;
  }, [headerHeight]);

  const styles = useStyles();

  const handleScrollCallback = useCallback(
    (event: ScrollEvent) => {
      if (handleScroll) {
        handleScroll((event.contentOffset.y / contentHeightRef.current) * 100);
      }
    },
    [handleScroll],
  );

  const onScroll = useAnimatedScrollHandler(
    {
      onScroll: (event) => {
        scheduleOnRN(handleScrollCallback, event);
      },
    },
    [handleScrollCallback],
  );

  const refreshControl = React.useMemo(() => {
    return refreshControlProps ? (
      <RefreshControl {...refreshControlProps} />
    ) : undefined;
  }, [refreshControlProps]);

  return (
    <View style={styles.content}>
      <Animated.ScrollView
        scrollEventThrottle={10}
        refreshControl={refreshControl}
        onScroll={onScroll}
      >
        <View onLayout={onHeaderContentLayout}>{header}</View>
        {children}
      </Animated.ScrollView>
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  content: {
    flex: 1,
    overflow: 'hidden',
  },
}));
