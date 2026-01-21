import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  RefreshControl,
  RefreshControlProps,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader, ScreenHeaderProps} from '../screen-header';
import * as React from 'react';
import {Ref, useState} from 'react';
import {ParallaxScroll} from '@atb/components/parallax-scroll';
import {FullScreenFooter} from '../screen-footer';
import {ContrastColor} from '@atb/theme/colors';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';

type Props = {
  headerProps: ScreenHeaderProps;
  /**
   * JSX content that will be displayed between header and children, and will
   * disappear with a parallax effect when scrolling.
   */
  parallaxContent?: (focusRef?: Ref<any>) => React.ReactNode;
  /**
   * When `parallaxContent` is set, the header text will appear gradually as the
   * user scrolls. If `titleAlwaysVisible` is true, it will make the header text
   * always visible instead.
   */
  titleAlwaysVisible?: boolean;
  handleScroll?: (scrollPercentage: number) => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  refreshControlProps?: RefreshControlProps;
  contentColor?: ContrastColor;
  avoidKeyboard?: boolean;
  testID?: string;
  /**
   * The ref for the header to focus on load and navigation changes.
   *
   * Must explicitly be undefined if header is not going to be focused.
   * E.g. if the header is not going to be visible, or content will be focused instead.
   */
  focusRef: Ref<any> | undefined;
};

type PropsWithParallaxContent = Props &
  Required<Pick<Props, 'parallaxContent'>>;

export function FullScreenView(props: Props) {
  const {top} = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const themeColor =
    props.headerProps.color ?? theme.color.background.accent[0];
  const backgroundColor = themeColor.background;

  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const titleShouldAnimate =
    props.titleAlwaysVisible || isScreenReaderEnabled
      ? false
      : !!props.parallaxContent;
  const [opacity, setOpacity] = useState(titleShouldAnimate ? 0 : 1);

  const handleScroll = (scrollPercentage: number) => {
    if (!titleShouldAnimate) return;
    if (scrollPercentage < 50) {
      setOpacity(0);
    } else {
      setOpacity(((scrollPercentage - 50) * 2) / 100);
    }
  };

  const contentComponent = hasParallaxContent(props) ? (
    <ChildrenWithParallaxScrollContent
      {...props}
      handleScroll={handleScroll}
      headerColor={backgroundColor}
    />
  ) : (
    <ChildrenInNormalScrollView {...props} contentColor={props.contentColor} />
  );

  return (
    <>
      <View
        style={{
          backgroundColor,
          paddingTop: top,
        }}
        testID={props.testID ? `${props.testID}` : ''}
      >
        <ScreenHeader
          {...props.headerProps}
          textOpacity={opacity}
          focusRef={isScreenReaderEnabled ? props.focusRef : undefined}
        />
      </View>

      {props.avoidKeyboard ? (
        <KeyboardAvoidingView behavior="padding" style={{flex: 1}}>
          {contentComponent}
        </KeyboardAvoidingView>
      ) : (
        contentComponent
      )}
      {!!props.footer && (
        <FullScreenFooter footerColor={backgroundColor}>
          {props.footer}
        </FullScreenFooter>
      )}
    </>
  );
}

const hasParallaxContent = (props: Props): props is PropsWithParallaxContent =>
  !!props.parallaxContent;

const ChildrenWithParallaxScrollContent = ({
  parallaxContent,
  refreshControlProps,
  children,
  headerColor,
  handleScroll,
  titleAlwaysVisible,
  focusRef,
}: PropsWithParallaxContent & {headerColor: string}) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ParallaxScroll
        header={
          <View style={{backgroundColor: headerColor}}>
            <View style={styles.childrenContainer}>
              {parallaxContent(!titleAlwaysVisible ? focusRef : undefined)}
            </View>
          </View>
        }
        refreshControlProps={refreshControlProps}
        handleScroll={handleScroll}
      >
        {children}
      </ParallaxScroll>
    </View>
  );
};

const ChildrenInNormalScrollView = ({
  refreshControlProps,
  children,
  contentColor,
}: Props & {contentColor?: ContrastColor}) => {
  const backgroundColor = contentColor?.background;

  return (
    <ScrollView
      refreshControl={
        refreshControlProps ? (
          <RefreshControl {...refreshControlProps} />
        ) : undefined
      }
      contentContainerStyle={{flexGrow: 1}}
      style={{backgroundColor}}
    >
      {children}
    </ScrollView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: theme.spacing.medium,
  },
  childrenContainer: {
    paddingBottom: theme.spacing.medium,
  },
}));
