import LogoOutline from './LogoOutline';
import {View, Text, Animated} from 'react-native';
import React, {useRef, useEffect} from 'react';
import {StyleSheet} from '../theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import insets from '../utils/insets';

type IconButton = {
  icon: React.ReactNode;
  onPress(): void;
};

type ScreenHeaderProps = {
  leftButton?: IconButton;
  rightButton?: IconButton;
  title: string;
  alternativeTitleComponent?: React.ReactNode;
  alternativeTitleVisible: boolean;
};

const HEADER_HEIGHT = 40;

const AnimatedScreenHeader: React.FC<ScreenHeaderProps> = ({
  leftButton,
  rightButton,
  title,
  alternativeTitleComponent,
  alternativeTitleVisible,
}) => {
  const css = useHeaderStyle();
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
      style={[
        css.regularContainer,
        {transform: [{translateY: altTitleOffset}]},
      ]}
    >
      {alternativeTitleComponent}
    </Animated.View>
  );

  return (
    <View style={css.container}>
      <View style={css.iconContainerLeft}>{leftIcon}</View>
      <View style={css.titleContainers}>
        <Animated.View
          style={[
            css.regularContainer,
            {transform: [{translateY: titleOffset}]},
          ]}
        >
          <Text style={css.text}>{title}</Text>
        </Animated.View>
        {altTitle}
      </View>
      <View style={css.iconContainerRight}>{rightIcon}</View>
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
