import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor} from '@atb/theme/colors';
import {RefreshControlProps, ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader, ScreenHeaderProps} from '../screen-header';
import * as React from 'react';
import {useState} from 'react';
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
  handleScroll?: (scrollPercentage: number) => void;
  children?: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
};

type PropsWithParallaxContent = Props &
  Required<Pick<Props, 'parallaxContent'>>;

export function FullScreenView(props: Props) {
  const {top} = useSafeAreaInsets();
  const {themeName} = useTheme();
  const themeColor = props.headerProps.color ?? 'background_accent_0';
  const backgroundColor = getStaticColor(themeName, themeColor).background;
  const [opacity, setOpacity] = useState(0);

  const handleScroll = (scrollPercentage: number) => {
    if (scrollPercentage < 50) {
      setOpacity(0);
    } else {
      setOpacity(((scrollPercentage - 50) * 2) / 100);
    }
  };

  return (
    <>
      <View
        style={{
          backgroundColor,
          paddingTop: top,
        }}
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
}: PropsWithParallaxContent & {backgroundColor: string}) => {
  const focusRef = useFocusOnLoad();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ParallaxScroll
        header={
          <View style={{backgroundColor}}>
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
