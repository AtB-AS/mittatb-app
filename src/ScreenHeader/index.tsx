import LogoOutline from './LogoOutline';
import {View, Text, AccessibilityProps, TouchableOpacity} from 'react-native';
import React from 'react';
import {StyleSheet} from '../theme';
import HeaderButton, {IconButton} from './HeaderButton';
import colors from '../theme/colors';

type ScreenHeaderProps = {
  leftButton?: IconButton;
  rightButton?: IconButton;
  title: string;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  leftButton,
  rightButton,
  title,
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
    <View style={css.container}>
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
    backgroundColor: colors.secondary.cyan,
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
