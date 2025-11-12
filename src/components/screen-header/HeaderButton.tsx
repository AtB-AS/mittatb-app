import React, {RefObject} from 'react';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {insets} from '@atb/utils/insets';
import {useNavigation} from '@react-navigation/native';
import {AccessibilityProps, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon, ThemeIconProps} from '@atb/components/theme-icon';
import {ArrowLeft} from '@atb/assets/svg/mono-icons/navigation';
import {useThemeContext} from '@atb/theme';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {
  AnalyticsEventContext,
  useAnalyticsContext,
} from '@atb/modules/analytics';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {Info} from '@atb/assets/svg/mono-icons/status';
import {ContrastColor} from '@atb/theme/colors';

export type ButtonModes =
  | 'back'
  | 'cancel'
  | 'close'
  | 'skip'
  | 'info'
  | 'custom';
export type HeaderButtonProps = {
  type: ButtonModes;
  onPress?: () => void;
  color?: ContrastColor;
  text?: string;
  testID?: string;
  /**
   * The context for the analytics event that will be logged when the button is
   * pressed. If no context provided, then no analytics event will be logged.
   */
  analyticsEventContext?: AnalyticsEventContext;
  focusRef?: RefObject<any>;
} & AccessibilityProps;

export type IconButtonProps = Omit<HeaderButtonProps, 'type'> & {
  children: React.ReactNode;
};

export const HeaderButton: React.FC<HeaderButtonProps> = (buttonProps) => {
  const analytics = useAnalyticsContext();
  const iconButton = useHeaderButton(buttonProps);
  if (!iconButton) {
    return null;
  }

  const {onPress, children, focusRef, ...accessibilityProps} = iconButton;

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
      ref={focusRef}
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

  const {t} = useTranslation();
  switch (buttonProps.type) {
    case 'back':
    case 'cancel':
    case 'skip':
    case 'close': {
      const {type, color, onPress, ...accessibilityProps} = buttonProps;
      return {
        children: (
          <View style={{flexDirection: 'row'}}>
            <HeaderButtonIcon mode={type} color={color} />
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
    case 'info':
      const {onPress, type, color, ...accessibilityProps} = buttonProps;
      return {
        children: <ThemeIcon svg={Info} color={color} />,
        accessibilityLabel: t(ScreenHeaderTexts.headerButton[type].text),
        onPress: onPress,
        ...accessibilityProps,
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
  color?: ContrastColor;
}) => {
  const {theme} = useThemeContext();
  const iconProps: Omit<ThemeIconProps, 'svg'> = {
    color: color,
    style: {marginRight: theme.spacing.xSmall},
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
