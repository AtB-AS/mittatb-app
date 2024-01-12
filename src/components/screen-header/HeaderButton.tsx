import React from 'react';
import {useChatIcon} from '@atb/chat/use-chat-icon';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {insets} from '@atb/utils/insets';
import {useNavigation} from '@react-navigation/native';
import {AccessibilityProps, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon, ThemeIconProps} from '@atb/components/theme-icon';
import {StaticColor, TextColor} from '@atb/theme/colors';
import {ArrowLeft} from '@atb/assets/svg/mono-icons/navigation';
import {useTheme} from '@atb/theme';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {useServiceDisruptionIcon} from '@atb/service-disruptions/use-service-disruption-icon';
import {AnalyticsEventContext, useAnalytics} from '@atb/analytics';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {Info} from '@atb/assets/svg/mono-icons/status';

export type ButtonModes =
  | 'back'
  | 'cancel'
  | 'close'
  | 'chat'
  | 'skip'
  | 'status-disruption'
  | 'info'
  | 'custom';
export type HeaderButtonProps = {
  type: ButtonModes;
  onPress?: () => void;
  color?: StaticColor | TextColor;
  text?: string;
  testID?: string;
  withIcon?: boolean;
  /**
   * The context for the analytics event that will be logged when the button is
   * pressed. If no context provided, then no analytics event will be logged.
   */
  analyticsEventContext?: AnalyticsEventContext;
} & AccessibilityProps;

export type IconButtonProps = Omit<HeaderButtonProps, 'type' | 'withIcon'> & {
  children: React.ReactNode;
};

export const HeaderButton: React.FC<HeaderButtonProps> = (buttonProps) => {
  const analytics = useAnalytics();
  const iconButton = useHeaderButton(buttonProps);
  if (!iconButton) {
    return null;
  }

  const {onPress, children, ...accessibilityProps} = iconButton;

  const onPressWithLogEvent = () => {
    if (buttonProps.analyticsEventContext) {
      analytics.logEvent(
        buttonProps.analyticsEventContext,
        `Header button of type ${buttonProps.type} clicked`,
      );
    }
    onPress?.();
  };

  return (
    <PressableOpacity
      onPress={onPressWithLogEvent}
      hitSlop={insets.all(12)}
      accessibilityRole="button"
      {...accessibilityProps}
    >
      {children}
    </PressableOpacity>
  );
};

const useHeaderButton = (
  buttonProps: HeaderButtonProps,
): IconButtonProps | undefined => {
  const navigation = useNavigation();
  const chatIcon = useChatIcon(buttonProps.color, buttonProps.testID);
  const serviceDisruptionIcon = useServiceDisruptionIcon(
    buttonProps.color,
    buttonProps.testID,
  );

  const {t} = useTranslation();
  switch (buttonProps.type) {
    case 'back':
    case 'cancel':
    case 'skip':
    case 'close': {
      const {type, color, onPress, withIcon, ...accessibilityProps} =
        buttonProps;
      return {
        children: (
          <View style={{flexDirection: 'row'}}>
            {withIcon ? <HeaderButtonIcon mode={type} color={color} /> : null}
            <ThemeText color={color}>
              {t(ScreenHeaderTexts.headerButton[type].text)}
            </ThemeText>
          </View>
        ),
        accessibilityHint: t(ScreenHeaderTexts.headerButton[type].a11yHint),
        onPress: onPress || navigation.goBack,
        ...accessibilityProps,
      };
    }
    case 'status-disruption': {
      return serviceDisruptionIcon;
    }
    case 'chat':
      return chatIcon;
    case 'info':
      const {onPress, type, color, ...accessibilityProps} = buttonProps;
      return {
        children: <ThemeIcon svg={Info} colorType={color}/>,
        accessibilityHint: t(ScreenHeaderTexts.headerButton[type].a11yHint),
        onPress: onPress,
        ...accessibilityProps
      };
    case 'custom': {
      const {text, color, onPress, ...accessibilityProps} = buttonProps;
      return {
        children: <ThemeText color={color}>{text}</ThemeText>,
        onPress: onPress,
        ...accessibilityProps,
      };
    }
  }
};

const HeaderButtonIcon = ({
  mode,
  color,
}: {
  mode: ButtonModes;
  color?: StaticColor | TextColor;
}) => {
  const {theme} = useTheme();
  const iconProps: Omit<ThemeIconProps, 'svg'> = {
    colorType: color,
    style: {marginRight: theme.spacings.xSmall},
  };

  switch (mode) {
    case 'back':
      return <ThemeIcon svg={ArrowLeft} {...iconProps} />;
    case 'close':
    case 'cancel':
      return <ThemeIcon svg={Close} {...iconProps} />;
    default:
      return null;
  }
};
