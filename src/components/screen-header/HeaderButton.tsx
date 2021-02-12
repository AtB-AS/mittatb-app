import {AccessibilityProps, TouchableOpacity} from 'react-native';
import React from 'react';
import insets from '../../utils/insets';
import {useNavigation} from '@react-navigation/native';
import ThemeText from '../text';
import {useNavigateToStartScreen} from '../../utils/navigation';
import useChatIcon from '../../chat/use-chat-icon';
import LogoOutline from './LogoOutline';
import ThemeIcon from '../theme-icon';
import {ScreenHeaderTexts, useTranslation} from '../../translations';

export type ButtonModes = 'back' | 'cancel' | 'close' | 'home' | 'chat';
export type HeaderButtonProps = {
  type: ButtonModes;
  onPress?: () => void;
} & AccessibilityProps;

export type IconButton = Omit<HeaderButtonProps, 'type'> & {
  icon: React.ReactNode;
};

const HeaderButton: React.FC<HeaderButtonProps> = (buttonProps) => {
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
  buttonProps: HeaderButtonProps,
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
