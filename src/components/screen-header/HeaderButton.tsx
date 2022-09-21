import useChatIcon from '@atb/chat/use-chat-icon';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import insets from '@atb/utils/insets';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {AccessibilityProps, TouchableOpacity} from 'react-native';
import ThemeText from '@atb/components/text';
import ThemeIcon from '@atb/components/theme-icon';
import {StaticColor, TextColor} from '@atb/theme/colors';
import ServiceDisruption from '@atb/assets/svg/mono-icons/status/ServiceDisruption';

export type ButtonModes =
  | 'back'
  | 'cancel'
  | 'close'
  | 'chat'
  | 'skip'
  | 'status-disruption'
  | 'custom';
export type HeaderButtonProps = {
  type: ButtonModes;
  onPress?: () => void;
  color?: StaticColor | TextColor;
  text?: string;
  testID?: string;
} & AccessibilityProps;

export type IconButton = Omit<HeaderButtonProps, 'type'> & {
  icon: React.ReactNode;
};

const HeaderButton: React.FC<HeaderButtonProps> = (buttonProps) => {
  const iconButton = useIconButton(buttonProps);
  if (!iconButton) {
    return null;
  }

  return <BaseHeaderButton {...iconButton} />;
};

export type HeaderButtonWithoutNavigationProps = {
  text: string;
  onPress: () => void;
  color?: StaticColor | TextColor;
  testID?: string;
} & AccessibilityProps;

export const HeaderButtonWithoutNavigation = ({
  text,
  onPress,
  color,
  ...accessibilityProps
}: HeaderButtonWithoutNavigationProps) => {
  return (
    <BaseHeaderButton
      icon={<ThemeText color={color}>{text}</ThemeText>}
      onPress={onPress}
      {...accessibilityProps}
    />
  );
};

const BaseHeaderButton = ({
  icon,
  onPress,
  ...accessibilityProps
}: IconButton) => (
  <TouchableOpacity
    onPress={onPress}
    hitSlop={insets.all(12)}
    accessibilityRole="button"
    {...accessibilityProps}
  >
    {icon}
  </TouchableOpacity>
);

const useIconButton = (
  buttonProps: HeaderButtonProps,
): IconButton | undefined => {
  const navigation = useNavigation();
  const chatIcon = useChatIcon(buttonProps.color, buttonProps.testID);
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
    case 'status-disruption': {
      const {type, color, onPress, testID, ...accessibilityProps} = buttonProps;
      return {
        icon: <ThemeIcon colorType={color} svg={ServiceDisruption} />,
        onPress: onPress,
        testID: 'serviceDisruptionButton',
        accessibilityHint: t(ScreenHeaderTexts.headerButton[type].a11yHint),
        ...accessibilityProps,
      };
    }
    case 'chat':
      return chatIcon;
    case 'custom': {
      const {type, text, color, onPress, ...accessibilityProps} = buttonProps;
      return {
        icon: <ThemeText color={color}>{text}</ThemeText>,
        onPress: onPress,
        ...accessibilityProps,
      };
    }
  }
};

export default HeaderButton;
