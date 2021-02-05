import {AccessibilityProps, TouchableOpacity} from 'react-native';
import React from 'react';
import insets from '../utils/insets';
import {LeftButtonProps, RightButtonProps} from './index';
import {useNavigation} from '@react-navigation/core';
import {RootStackParamList} from '../navigation';
import {NavigationProp} from '@react-navigation/native';
import ThemeText from '../components/text';
import {useNavigateToStartScreen} from '../utils/navigation';
import useChatIcon from '../chat/use-chat-icon';
import LogoOutline from './LogoOutline';
import ThemeIcon from '../components/theme-icon';

export type IconButton = {
  icon: React.ReactNode;
  onPress?(): void;
} & AccessibilityProps;

const HeaderButton: React.FC<LeftButtonProps | RightButtonProps> = (
  buttonProps,
) => {
  const iconButton = useIconButton(buttonProps);
  if (!iconButton) {
    return null;
  }

  const {icon, onPress, ...accessibilityProps} = iconButton;

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={insets.all(12)}
      accessibilityRole="button"
      {...accessibilityProps}
    >
      {icon}
    </TouchableOpacity>
  );
};

const useIconButton = (
  buttonProps: LeftButtonProps | RightButtonProps,
): IconButton | undefined => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const navigateHome = useNavigateToStartScreen();
  const chatIcon = useChatIcon();
  switch (buttonProps.type) {
    case 'back':
      return {
        icon: <ThemeText>Tilbake</ThemeText>,
        onPress: buttonProps.onPress || (() => navigation.goBack()),
        ...buttonProps,
      };
    case 'cancel':
      return {
        icon: <ThemeText>Avbryt</ThemeText>,
        onPress: buttonProps.onPress || (() => navigation.goBack()),
        ...buttonProps,
      };
    case 'close':
      return {
        icon: <ThemeText>Lukk</ThemeText>,
        onPress: buttonProps.onPress || (() => navigation.goBack()),
        ...buttonProps,
      };
    case 'home':
      return {
        icon: <ThemeIcon svg={LogoOutline} />,
        onPress: buttonProps.onPress || navigateHome,
        accessibilityHint: 'Gå til startskjerm',
        ...buttonProps,
      };
    case 'chat':
      return chatIcon;
  }
};

export default HeaderButton;
