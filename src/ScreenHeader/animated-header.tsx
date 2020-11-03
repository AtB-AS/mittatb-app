import React, {useEffect, useRef} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import ThemeText from '../components/text';
import {StyleSheet} from '../theme';
import HeaderButton, {IconButton} from './HeaderButton';
type ScreenHeaderProps = ViewProps & {
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
          <ThemeText type="paragraphHeadline">{title}</ThemeText>
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
