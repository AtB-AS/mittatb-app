import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor} from '@atb/theme/colors';
import {Animated, Easing, RefreshControlProps, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader, ScreenHeaderProps} from '../screen-header';
import * as React from 'react';
import {ParallaxScroll} from '@atb/components/parallax-scroll';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {ScrollView, useScroller} from '@atb/ScrollContext';
import {useEffect, useState} from 'react';

type Props = {
  headerProps: ScreenHeaderProps;
  /**
   * JSX content that will be displayed between header and children, and will
   * disappear with a parallax effect when scrolling.
   */
  parallaxContent?: (
    focusRef?: React.MutableRefObject<null>,
  ) => React.ReactNode;

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
  const {titleShowing, opacity} = useScroller();
  const [titleFade] = useState(new Animated.Value(0));

  useEffect(() => {
    !titleShowing &&
      Animated.timing(titleFade, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.sin,
      }).start();

    titleShowing &&
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.sin,
      }).start();
  }, [titleShowing]);

  return (
    <>
      {titleShowing ? (
        <View
          style={{
            backgroundColor,
            paddingTop: top,
            shadowOpacity: opacity,
          }}
        >
          <ScreenHeader
            {...props.headerProps}
            textOpacity={titleFade}
            setFocusOnLoad={!props.parallaxContent}
          />
        </View>
      ) : (
        <View style={{backgroundColor, paddingTop: top}}>
          <ScreenHeader
            leftButton={props.headerProps.leftButton}
            setFocusOnLoad={!props.parallaxContent}
          />
        </View>
      )}

      {hasParallaxContent(props) ? (
        <ChildrenWithParallaxScrollContent
          {...props}
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
}: PropsWithParallaxContent & {backgroundColor: string}) => {
  const focusRef = useFocusOnLoad();
  const styles1 = useStyles();
  return (
    <View style={styles1.container}>
      <ParallaxScroll
        header={
          <View style={[styles1.headerContainer, {backgroundColor}]}>
            <View style={styles1.childrenContainer}>
              {parallaxContent(focusRef)}
            </View>
          </View>
        }
        refreshControl={refreshControl}
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
  topContainer: {
    marginVertical: theme.spacings.medium,
    marginHorizontal: theme.spacings.medium,
  },
  headerTitle: {
    marginBottom: theme.spacings.medium,
  },
  childrenContainer: {
    paddingBottom: theme.spacings.medium,
  },
  globalMessageBox: {
    marginBottom: theme.spacings.medium,
  },
}));

export const styles = StyleSheet.create({
  header: {
    display: 'flex',
    width: '100%',
    height: 44,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: '#fff',
    shadowRadius: 0,
    shadowColor: 'blue',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    zIndex: 9,
  },
  headerTitle: {
    display: 'flex',
    flexBasis: '33%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  headerLeft: {
    flexBasis: '33%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
  },
  headerRight: {
    flexBasis: '33%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    color: 'blue',
  },
  headerText: {
    textAlign: 'center',
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'center',
    fontSize: 17,
    fontWeight: '600',
  },
});
