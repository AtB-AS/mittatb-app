import LogoOutline from './LogoOutline';
import {View, Text, AccessibilityProps} from 'react-native';
import React from 'react';
import {StyleSheet} from '../theme';
import {TouchableOpacity} from 'react-native-gesture-handler';
import insets from '../utils/insets';

type IconButton = {
  icon: React.ReactNode;
  onPress(): void;
} & AccessibilityProps;

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
    <TouchableOpacity hitSlop={insets.all(8)} {...leftButton}>
      {leftButton.icon}
    </TouchableOpacity>
  ) : (
    <LogoOutline />
  );

  const rightIcon = rightButton ? (
    <TouchableOpacity hitSlop={insets.all(8)} {...rightButton}>
      {rightButton.icon}
    </TouchableOpacity>
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
    fontWeight: '600',
  },
}));
