import {View, Text, ViewStyle} from 'react-native';
import React from 'react';
import {StyleSheet} from '../theme';
import HeaderButton, {IconButton} from './HeaderButton';

type ScreenHeaderProps = {
  leftButton?: IconButton;
  rightButton?: IconButton;
  title: string;
  style?: ViewStyle;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  leftButton,
  rightButton,
  title,
  style,
}) => {
  const css = useHeaderStyle();

  const leftIcon = leftButton ? (
    <HeaderButton iconButton={leftButton} />
  ) : (
    <View />
  );
  const rightIcon = rightButton ? (
    <HeaderButton iconButton={rightButton} />
  ) : (
    <View />
  );

  return (
    <View style={[css.container, style]}>
      <View style={css.iconContainerLeft}>{leftIcon}</View>
      <Text style={css.text}>{title}</Text>
      <View style={css.iconContainerRight}>{rightIcon}</View>
    </View>
  );
};
export default ScreenHeader;
const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.sizes.pagePadding,
    height: 64,
  },
  iconContainerLeft: {
    position: 'absolute',
    left: 12,
  },
  iconContainerRight: {
    position: 'absolute',
    right: 12,
  },
  text: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
}));
