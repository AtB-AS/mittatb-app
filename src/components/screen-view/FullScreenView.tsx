import {StyleSheet, useTheme} from '@atb/theme';
import {getStaticColor} from '@atb/theme/colors';
import {RefreshControlProps, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader, ScreenHeaderProps} from '../screen-header';
import * as React from 'react';
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

  return (
    <>
      <View style={{backgroundColor, paddingTop: top}}>
        <ScreenHeader
          {...props.headerProps}
          setFocusOnLoad={!props.parallaxContent}
        />
      </View>
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
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ParallaxScroll
        header={
          <View style={[styles.headerContainer, {backgroundColor}]}>
            <View style={styles.childrenContainer}>
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
