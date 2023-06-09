import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor} from '@atb/theme/colors';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  RefreshControlProps,
  ScrollView,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader, ScreenHeaderProps} from '../screen-header';
import * as React from 'react';
import {useMemo, useState} from 'react';
import {ParallaxScroll} from '@atb/components/parallax-scroll';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';

type Props = {
  headerProps: ScreenHeaderProps;
  /**
   * JSX content that will be displayed between header and children, and will
   * disappear with a parallax effect when scrolling.
   */
  parallaxContent?: (
    focusRef?: React.MutableRefObject<null>,
  ) => React.ReactNode;
  handleScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  children?: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  setLayoutFor?: (
    element: keyof HeaderLayouts,
  ) => ({nativeEvent: {layout}}: LayoutChangeEvent) => void;
};

type PropsWithParallaxContent = Props &
  Required<Pick<Props, 'parallaxContent'>>;

export function FullScreenView(props: Props) {
  const {top} = useSafeAreaInsets();
  const {themeName} = useTheme();
  const themeColor = props.headerProps.color ?? 'background_accent_0';
  const backgroundColor = getStaticColor(themeName, themeColor).background;
  const [opacity, setOpacity] = useState(0);
  const {scrollMinOffset, scrollMaxOffset, setLayoutFor} = useScrollOffsets();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setOpacity(
      withinOpacityBounds(
        ((event.nativeEvent.contentOffset.y - scrollMinOffset) * 2) /
          scrollMaxOffset,
        0,
        1,
      ),
    );
  };

  return (
    <>
      <View
        style={{
          backgroundColor,
          paddingTop: top,
        }}
        onLayout={setLayoutFor('screenHeader')}
      >
        <ScreenHeader
          {...props.headerProps}
          textOpacity={opacity}
          setFocusOnLoad={!props.parallaxContent}
        />
      </View>

      {hasParallaxContent(props) ? (
        <ChildrenWithParallaxScrollContent
          {...props}
          handleScroll={handleScroll}
          backgroundColor={backgroundColor}
          setLayoutFor={setLayoutFor}
        />
      ) : (
        <ChildrenInNormalScrollView {...props} />
      )}
    </>
  );
}

const hasParallaxContent = (props: Props): props is PropsWithParallaxContent =>
  !!props.parallaxContent;

const ChildrenWithParallaxScrollContent = ({
  parallaxContent,
  refreshControl,
  children,
  backgroundColor,
  handleScroll,
  setLayoutFor,
}: PropsWithParallaxContent & {backgroundColor: string}) => {
  const focusRef = useFocusOnLoad();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ParallaxScroll
        header={
          <View
            style={{backgroundColor}}
            onLayout={
              setLayoutFor ? setLayoutFor('parallaxContent') : undefined
            }
          >
            <View style={styles.childrenContainer}>
              {parallaxContent(focusRef)}
            </View>
          </View>
        }
        refreshControl={refreshControl}
        handleScroll={handleScroll}
      >
        {children}
      </ParallaxScroll>
    </View>
  );
};

const ChildrenInNormalScrollView = ({refreshControl, children}: Props) => (
  <ScrollView refreshControl={refreshControl}>{children}</ScrollView>
);
const withinOpacityBounds = (
  val: number,
  minOpacity: number,
  maxOpacity: number,
): number =>
  val > maxOpacity ? maxOpacity : val < minOpacity ? minOpacity : val;

type HeaderLayouts = {
  parallaxContent?: LayoutRectangle;
  screenHeader?: LayoutRectangle;
};
const useScrollOffsets = () => {
  const [headerLayouts, setHeaderLayouts] = useState<HeaderLayouts>({});
  const setLayoutFor =
    (element: keyof HeaderLayouts) =>
    ({nativeEvent: {layout}}: LayoutChangeEvent) => {
      setHeaderLayouts((prev) => ({...prev, [element]: layout}));
    };
  const parallaxContentHeight = useMemo(() => {
    const {screenHeader, parallaxContent} = headerLayouts;
    if (!parallaxContent || !screenHeader) {
      return 0;
    }
    return parallaxContent.height;
  }, [headerLayouts]);

  const scrollMinOffset = parallaxContentHeight * 0.5;
  const scrollMaxOffset = parallaxContentHeight;

  return {
    scrollMaxOffset,
    scrollMinOffset,
    setLayoutFor,
  };
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: theme.spacings.medium,
  },
  childrenContainer: {
    paddingBottom: theme.spacings.medium,
  },
}));
