import React, {useEffect, useRef} from 'react';
import {Animated, Text, View, ViewProps, TouchableOpacity} from 'react-native';
import {StyleSheet} from '../theme';
import insets from '../utils/insets';
import LogoOutline from './LogoOutline';

type IconButton = {
  icon: React.ReactNode;
  onPress(): void;
};

type ScreenHeaderProps = ViewProps & {
  leftButton?: IconButton;
  rightButton?: IconButton;
  title: string;
  alternativeTitleComponent?: React.ReactNode;
  alternativeTitleVisible: boolean;
  onLogoClick?(): void;
};

const HEADER_HEIGHT = 40;

const AnimatedScreenHeader: React.FC<ScreenHeaderProps> = ({
  leftButton,
  rightButton,
  title,
  alternativeTitleComponent,
  alternativeTitleVisible,
  onLogoClick,
  ...props
}) => {
  const style = useHeaderStyle();
  const altTitleOffset = useRef(new Animated.Value(HEADER_HEIGHT)).current;

  useEffect(() => {
    if (!alternativeTitleComponent) return;
    Animated.timing(altTitleOffset, {
      toValue: alternativeTitleVisible ? 0 : HEADER_HEIGHT,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [alternativeTitleVisible, alternativeTitleComponent]);

  const titleOffset = Animated.subtract(altTitleOffset, HEADER_HEIGHT);

  const leftIcon = leftButton ? (
    <TouchableOpacity onPress={leftButton.onPress} hitSlop={insets.all(8)}>
      {leftButton.icon}
    </TouchableOpacity>
  ) : onLogoClick ? (
    <TouchableOpacity onPress={onLogoClick}>
      <LogoOutline />
    </TouchableOpacity>
  ) : (
    <LogoOutline />
  );

  const rightIcon = rightButton ? (
    <TouchableOpacity onPress={rightButton.onPress} hitSlop={insets.all(8)}>
      {rightButton.icon}
    </TouchableOpacity>
  ) : (
    <View />
  );

  const altTitle = alternativeTitleComponent && (
    <Animated.View
      {...props}
      style={[
        style.regularContainer,
        {transform: [{translateY: altTitleOffset}]},
      ]}
    >
      {alternativeTitleComponent}
    </Animated.View>
  );

  return (
    <View style={style.container}>
      <View style={style.iconContainerLeft}>{leftIcon}</View>
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
          <Text style={style.text}>{title}</Text>
        </Animated.View>
        {altTitle}
      </View>
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
    padding: theme.sizes.pagePadding,
    backgroundColor: theme.background.accent,
  },
  iconContainerLeft: {
    position: 'absolute',
    left: theme.sizes.pagePadding,
  },
  iconContainerRight: {
    position: 'absolute',
    right: theme.sizes.pagePadding,
  },
  titleContainers: {
    height: HEADER_HEIGHT,
    flex: 1,
    alignItems: 'stretch',
    overflow: 'hidden',
    marginHorizontal: theme.sizes.pagePadding + 30,
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
  text: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
}));
