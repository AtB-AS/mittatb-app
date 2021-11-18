import {StyleSheet} from '@atb/theme';
import React from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ThemeText from '@atb/components/text';
import HeaderButton from './HeaderButton';
import {LeftButtonProps, RightButtonProps} from '.';
import useFontScale from '@atb/utils/use-font-scale';
import useFocusOnLoad from '@atb/utils/use-focus-on-load';
import {ThemeColor} from '@atb/theme/colors';

type ScreenHeaderProps = ViewProps & {
  leftButton?: LeftButtonProps;
  rightButton?: RightButtonProps;
  title: React.ReactNode;
  alternativeTitleComponent?: React.ReactNode;
  showAlternativeTitle?: Boolean;
  scrollRef?: Animated.Value;
  setFocusOnLoad?: boolean;
};

const themeColor: ThemeColor = 'background_accent';

const BASE_HEADER_HEIGHT = 20;

const AnimatedScreenHeader: React.FC<ScreenHeaderProps> = ({
  leftButton,
  rightButton,
  title,
  alternativeTitleComponent,
  showAlternativeTitle,
  scrollRef,
  setFocusOnLoad,
  ...props
}) => {
  const style = useHeaderStyle();
  const insets = useSafeAreaInsets();

  const fontScale = useFontScale();
  const headerHeight = BASE_HEADER_HEIGHT * fontScale;

  const titleOffset = showAlternativeTitle
    ? scrollRef!.interpolate({
        inputRange: [0, headerHeight + insets.top],
        outputRange: [0, -headerHeight],
        extrapolate: 'clamp',
      })
    : 0;

  const altTitleOffset = Animated.add(titleOffset, headerHeight);
  const altTitleVisibility = showAlternativeTitle ? 'flex' : 'none';
  const leftIcon = leftButton ? <HeaderButton {...leftButton} /> : <View />;
  const rightIcon = rightButton ? <HeaderButton {...rightButton} /> : <View />;

  const altTitle = alternativeTitleComponent && (
    <Animated.View
      style={[
        style.regularContainer,
        {
          height: headerHeight,
          transform: [{translateY: altTitleOffset}],
          display: altTitleVisibility,
        },
      ]}
    >
      {alternativeTitleComponent}
    </Animated.View>
  );

  const focusRef = useFocusOnLoad(setFocusOnLoad);

  return (
    <View style={style.container} {...props}>
      <View style={[style.titleContainers, {height: headerHeight}]}>
        <Animated.View
          style={[
            style.regularContainer,
            {transform: [{translateY: titleOffset}]},
          ]}
        >
          <View accessible={true} accessibilityRole="header" ref={focusRef}>
            <ThemeText color={themeColor} type="body__primary--bold">
              {title}
            </ThemeText>
          </View>
        </Animated.View>
        {altTitle}
      </View>
      <View style={style.buttonsContainer}>
        <View>{leftIcon}</View>
        <View>{rightIcon}</View>
      </View>
    </View>
  );
};
export default AnimatedScreenHeader;

const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacings.medium,
    backgroundColor: theme.colors[themeColor].backgroundColor,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: theme.spacings.medium,
    width: '100%',
  },
  titleContainers: {
    flex: 1,
    alignItems: 'stretch',
    overflow: 'hidden',
    marginHorizontal: theme.spacings.medium + 30,
  },
  regularContainer: {
    flex: 1,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
}));
