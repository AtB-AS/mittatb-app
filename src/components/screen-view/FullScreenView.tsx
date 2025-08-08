import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  RefreshControlProps,
  ScrollView,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ScreenHeader, ScreenHeaderProps} from '../screen-header';
import * as React from 'react';
import {Ref, useState} from 'react';
import {ParallaxScroll} from '@atb/components/parallax-scroll';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {FullScreenFooter} from '../screen-footer';
import {ContrastColor} from '@atb/theme/colors';

type Props = {
  headerProps: ScreenHeaderProps;
  /**
   * JSX content that will be displayed between header and children, and will
   * disappear with a parallax effect when scrolling.
   */
  parallaxContent?: (focusRef?: Ref<any>) => React.ReactNode;
  handleScroll?: (scrollPercentage: number) => void;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  contentColor?: ContrastColor;
  avoidKeyboard?: boolean;
};

type PropsWithParallaxContent = Props &
  Required<Pick<Props, 'parallaxContent'>>;

export function FullScreenView(props: Props) {
  const {top} = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const themeColor =
    props.headerProps.color ?? theme.color.background.accent[0];
  const backgroundColor = themeColor.background;
  const [opacity, setOpacity] = useState(props.parallaxContent ? 0 : 1);

  const handleScroll = (scrollPercentage: number) => {
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
      >
        <ScreenHeader
          {...props.headerProps}
          textOpacity={opacity}
          setFocusOnLoad={
            props.parallaxContent ? false : props.headerProps.setFocusOnLoad
          }
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
  refreshControl,
  children,
  headerColor,
  handleScroll,
}: PropsWithParallaxContent & {headerColor: string}) => {
  const focusRef = useFocusOnLoad();
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <ParallaxScroll
        header={
          <View style={{backgroundColor: headerColor}}>
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

const ChildrenInNormalScrollView = ({
  refreshControl,
  children,
  contentColor,
}: Props & {contentColor?: ContrastColor}) => {
  const backgroundColor = contentColor?.background;

  return (
    <ScrollView
      refreshControl={refreshControl}
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
