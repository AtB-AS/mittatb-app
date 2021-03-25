import {StyleSheet} from '@atb/theme';
import React from 'react';
import {Animated, useWindowDimensions, View, ViewProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ThemeText, {MAX_FONT_SCALE} from '@atb/components/text';
import HeaderButton from './HeaderButton';
import {LeftButtonProps, RightButtonProps} from '.';
type ScreenHeaderProps = ViewProps & {
  leftButton?: LeftButtonProps;
  rightButton?: RightButtonProps;
  title: React.ReactNode;
  alternativeTitleComponent?: React.ReactNode;
  scrollRef?: Animated.Value;
};

const BASE_HEADER_HEIGHT = 20;

const AnimatedScreenHeader: React.FC<ScreenHeaderProps> = ({
  leftButton,
  rightButton,
  title,
  alternativeTitleComponent,
  scrollRef,
  ...props
}) => {
  const style = useHeaderStyle();
  const insets = useSafeAreaInsets();

  const {fontScale} = useWindowDimensions();
  const headerHeight = BASE_HEADER_HEIGHT * Math.min(fontScale, MAX_FONT_SCALE);

  const titleOffset = scrollRef!.interpolate({
    inputRange: [0, headerHeight + insets.top],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const altTitleOffset = Animated.add(titleOffset, headerHeight);
  const leftIcon = leftButton ? <HeaderButton {...leftButton} /> : <View />;
  const rightIcon = rightButton ? <HeaderButton {...rightButton} /> : <View />;

  const altTitle = alternativeTitleComponent && (
    <Animated.View
      style={[
        style.regularContainer,
        {
          height: headerHeight,
          transform: [{translateY: altTitleOffset}],
        },
      ]}
    >
      {alternativeTitleComponent}
    </Animated.View>
  );

  return (
    <View style={style.container} {...props}>
      <View
        accessible={true}
        accessibilityRole="header"
        style={[style.titleContainers, {height: headerHeight}]}
      >
        <Animated.View
          style={[
            style.regularContainer,
            {transform: [{translateY: titleOffset}]},
          ]}
        >
          <View accessible={true} accessibilityRole="header">
            <ThemeText type="body__primary--bold">{title}</ThemeText>
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
    backgroundColor: theme.background.header,
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
