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
import {FullScreenFooter} from '../screen-footer';
import {ContrastColor} from '@atb/theme/colors';
import {useIsScreenReaderEnabled} from '@atb/utils/use-is-screen-reader-enabled';
import {useLayout} from '@atb/utils/use-layout';

type Props = {
  headerProps: ScreenHeaderProps;
  /**
   * JSX content that will be displayed between header and children, and will
   * disappear when scrolling.
   */
  headerContent?: (focusRef?: Ref<any>) => React.ReactNode;
  /**
   * When `headerContent` is set, the header text will appear gradually as the
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

type PropsWithHeaderContent = Props & Required<Pick<Props, 'headerContent'>>;

export function FullScreenView(props: Props) {
  const {top} = useSafeAreaInsets();
  const {theme} = useThemeContext();
  const themeColor =
    props.headerProps.color ?? theme.color.background.neutral[1];
  const backgroundColor = themeColor.background;

  const isScreenReaderEnabled = useIsScreenReaderEnabled();

  const titleShouldAnimate =
    props.titleAlwaysVisible || isScreenReaderEnabled
      ? false
      : !!props.headerContent;
  const [opacity, setOpacity] = useState(titleShouldAnimate ? 0 : 1);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (scrollPercentage: number) => {
    if (!titleShouldAnimate) return;
    if (scrollPercentage < 50) {
      setOpacity(0);
    } else {
      setOpacity(((scrollPercentage - 50) * 2) / 100);
    }
  };

  const showBorder = props.headerProps.showBorder ?? isScrolled;

  const contentComponent = hasHeaderContent(props) ? (
    <ChildrenWithHeaderContent
      {...props}
      handleScroll={handleScroll}
      headerColor={backgroundColor}
      contentColor={props.contentColor}
      onScrolledChange={setIsScrolled}
    />
  ) : (
    <ChildrenInNormalScrollView
      {...props}
      contentColor={props.contentColor}
      onScrolledChange={setIsScrolled}
    />
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
          showBorder={showBorder}
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

const hasHeaderContent = (props: Props): props is PropsWithHeaderContent =>
  !!props.headerContent;

const ChildrenWithHeaderContent = ({
  headerContent,
  refreshControlProps,
  children,
  headerColor,
  contentColor,
  handleScroll,
  titleAlwaysVisible,
  focusRef,
  onScrolledChange,
}: PropsWithHeaderContent & {
  headerColor: string;
  contentColor?: ContrastColor;
  handleScroll: (scrollPercentage: number) => void;
  onScrolledChange: (isScrolled: boolean) => void;
}) => {
  const styles = useStyles();
  const {onLayout, height: headerHeight} = useLayout();
  const headerHeightRef = React.useRef(headerHeight);
  const isScrolledRef = React.useRef(false);

  React.useEffect(() => {
    headerHeightRef.current = headerHeight;
  }, [headerHeight]);

  const childrenBackgroundColor = contentColor?.background;

  return (
    <View style={{flex: 1, backgroundColor: headerColor}}>
      <ScrollView
        scrollEventThrottle={16}
        refreshControl={
          refreshControlProps ? (
            <RefreshControl {...refreshControlProps} />
          ) : undefined
        }
        onScroll={(event) => {
          const offsetY = event.nativeEvent.contentOffset.y;
          const scrolled = offsetY > 0;
          if (scrolled !== isScrolledRef.current) {
            isScrolledRef.current = scrolled;
            onScrolledChange(scrolled);
          }
          if (headerHeightRef.current > 0) {
            handleScroll((offsetY / headerHeightRef.current) * 100);
          }
        }}
        contentContainerStyle={{flexGrow: 1}}
      >
        <View onLayout={onLayout} style={{backgroundColor: headerColor}}>
          <View style={styles.childrenContainer}>
            {headerContent(!titleAlwaysVisible ? focusRef : undefined)}
          </View>
        </View>
        {childrenBackgroundColor ? (
          <View style={{flex: 1, backgroundColor: childrenBackgroundColor}}>
            {children}
          </View>
        ) : (
          children
        )}
      </ScrollView>
    </View>
  );
};

const ChildrenInNormalScrollView = ({
  refreshControlProps,
  children,
  contentColor,
  onScrolledChange,
}: Props & {
  contentColor?: ContrastColor;
  onScrolledChange: (isScrolled: boolean) => void;
}) => {
  const backgroundColor = contentColor?.background;
  const isScrolledRef = React.useRef(false);

  return (
    <ScrollView
      scrollEventThrottle={16}
      refreshControl={
        refreshControlProps ? (
          <RefreshControl {...refreshControlProps} />
        ) : undefined
      }
      onScroll={(event) => {
        const scrolled = event.nativeEvent.contentOffset.y > 0;
        if (scrolled !== isScrolledRef.current) {
          isScrolledRef.current = scrolled;
          onScrolledChange(scrolled);
        }
      }}
      contentContainerStyle={{flexGrow: 1}}
      style={{backgroundColor}}
    >
      {children}
    </ScrollView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  headerContainer: {
    paddingHorizontal: theme.spacing.medium,
  },
  childrenContainer: {
    paddingBottom: theme.spacing.medium,
  },
}));
