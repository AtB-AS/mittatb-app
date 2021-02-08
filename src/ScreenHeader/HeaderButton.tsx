import {AccessibilityProps, TouchableOpacity} from 'react-native';
import React from 'react';
import insets from '../utils/insets';
import {LeftButtonProps, RightButtonProps} from './index';
import {useNavigation} from '@react-navigation/native';
import ThemeText from '../components/text';
import {useNavigateToStartScreen} from '../utils/navigation';
import useChatIcon from '../chat/use-chat-icon';
import LogoOutline from './LogoOutline';
import ThemeIcon from '../components/theme-icon';
import {ScreenHeaderTexts, useTranslation} from '../translations';

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
  const navigation = useNavigation();
  const navigateHome = useNavigateToStartScreen();
  const chatIcon = useChatIcon();
  const {t} = useTranslation();
  switch (buttonProps.type) {
    case 'back':
    case 'cancel':
    case 'close': {
      const {type, onPress, ...accessibilityProps} = buttonProps;
      return {
        icon: (
          <ThemeText>{t(ScreenHeaderTexts.headerButton[type].text)}</ThemeText>
        ),
        accessibilityHint: t(ScreenHeaderTexts.headerButton[type].a11yHint),
        onPress: onPress || (() => navigation.goBack()),
        ...accessibilityProps,
      };
    }
    case 'home': {
      const {type, onPress, ...accessibilityProps} = buttonProps;
      return {
        icon: <ThemeIcon svg={LogoOutline} />,
        onPress: onPress || navigateHome,
        accessibilityHint: t(ScreenHeaderTexts.headerButton[type].a11yHint),
        ...accessibilityProps,
      };
    }
    case 'chat':
      return chatIcon;
  }
};

export default HeaderButton;
