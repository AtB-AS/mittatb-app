import useChatIcon from '@atb/chat/use-chat-icon';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import insets from '@atb/utils/insets';
import {useNavigateToStartScreen} from '@atb/utils/navigation';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {AccessibilityProps, TouchableOpacity} from 'react-native';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import LogoOutline from './LogoOutline';
import {ThemeColor} from '@atb/theme/colors';

export type ButtonModes =
  | 'back'
  | 'cancel'
  | 'close'
  | 'home'
  | 'chat'
  | 'skip';
export type HeaderButtonProps = {
  type: ButtonModes;
  onPress?: () => void;
  color?: ThemeColor;
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
  const chatIcon = useChatIcon(buttonProps.color);
  const {t} = useTranslation();
  switch (buttonProps.type) {
    case 'back':
    case 'cancel':
    case 'skip':
    case 'close': {
      const {type, color, onPress, ...accessibilityProps} = buttonProps;
      return {
        icon: (
          <ThemeText color={color}>
            {t(ScreenHeaderTexts.headerButton[type].text)}
          </ThemeText>
        ),
        accessibilityHint: t(ScreenHeaderTexts.headerButton[type].a11yHint),
        onPress:
          onPress ||
          (() => {
            navigation.goBack();
          }),
        ...accessibilityProps,
      };
    }
    case 'home': {
      const {type, color, onPress, ...accessibilityProps} = buttonProps;
      return {
        icon: <ThemeIcon colorType={color} svg={LogoOutline} />,
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
