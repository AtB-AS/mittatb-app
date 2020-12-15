import React, {useEffect, useRef} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ThemeText from '../components/text';
import {StyleSheet} from '../theme';
import HeaderButton, {IconButton} from './HeaderButton';
type ScreenHeaderProps = ViewProps & {
  leftButton?: IconButton;
  rightButton?: IconButton;
  title: React.ReactNode;
  alternativeTitleComponent?: React.ReactNode;
  scrollRef?: Animated.Value;
};

const HEADER_HEIGHT = 20;

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
  const titleOffset = scrollRef!.interpolate({
    inputRange: [0, HEADER_HEIGHT + insets.top],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });
  const altTitleOffset = Animated.add(titleOffset, HEADER_HEIGHT);
  const leftIcon = leftButton ? <HeaderButton {...leftButton} /> : <View />;
  const rightIcon = rightButton ? <HeaderButton {...rightButton} /> : <View />;

  const altTitle = alternativeTitleComponent && (
    <Animated.View
      style={[
        style.regularContainer,
        {transform: [{translateY: altTitleOffset}]},
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
        style={style.titleContainers}
      >
        <Animated.View
          style={[
            style.regularContainer,
            {transform: [{translateY: titleOffset}]},
          ]}
        >
          <View accessible={true} accessibilityRole="header">
            <ThemeText type="paragraphHeadline">{title}</ThemeText>
          </View>
        </Animated.View>
        {altTitle}
      </View>
      <View style={style.iconContainerLeft}>{leftIcon}</View>
      <View style={style.iconContainerRight}>{rightIcon}</View>
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
  iconContainerLeft: {
    position: 'absolute',
    left: theme.spacings.medium,
  },
  iconContainerRight: {
    position: 'absolute',
    right: theme.spacings.medium,
  },
  titleContainers: {
    height: HEADER_HEIGHT,
    flex: 1,
    alignItems: 'stretch',
    overflow: 'hidden',
    marginHorizontal: theme.spacings.medium + 30,
  },
  regularContainer: {
    height: HEADER_HEIGHT,
    flex: 1,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
}));
