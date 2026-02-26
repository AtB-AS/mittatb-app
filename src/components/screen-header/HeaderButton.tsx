import React, {RefObject} from 'react';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {insets} from '@atb/utils/insets';
// eslint-disable-next-line rulesdir/navigation-only-in-screens
import {useNavigation} from '@react-navigation/native';
import {AccessibilityProps, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ArrowLeft} from '@atb/assets/svg/mono-icons/navigation';
import {StyleSheet} from '@atb/theme';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {
  AnalyticsEventContext,
  useAnalyticsContext,
} from '@atb/modules/analytics';
import {NativeButton} from '@atb/components/native-button';
import {ContrastColor} from '@atb/theme/colors';

export type ButtonModes = 'back' | 'cancel' | 'close' | 'custom';
export type HeaderButtonProps = {
  type: ButtonModes;
  onPress?: () => void;
  color?: ContrastColor;
  text?: string;
  testID?: string;
  /** SVG to use when type is 'custom' */
  svg?: ({fill}: {fill: string}) => React.JSX.Element;
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
    <NativeButton
      onPress={onPressWithLogEvent}
      hitSlop={insets.all(12)}
      accessibilityRole="button"
      ref={focusRef}
      {...accessibilityProps}
    >
      {children}
    </NativeButton>
  );
};

const useHeaderButton = (
  buttonProps: HeaderButtonProps,
): IconButtonProps | undefined => {
  // eslint-disable-next-line rulesdir/navigation-only-in-screens
  const navigation = useNavigation();
  const styles = useStyles();

  const {t} = useTranslation();
  switch (buttonProps.type) {
    case 'back': {
      const {type, color, onPress, ...accessibilityProps} = buttonProps;
      return {
        children: (
          <View style={styles.headerButtonContainer}>
            <ThemeIcon svg={ArrowLeft} color={color} />
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
    case 'cancel':
    case 'close': {
      const {type, color, onPress, ...accessibilityProps} = buttonProps;
      return {
        children: (
          <View style={styles.headerButtonContainer}>
            <ThemeText color={color}>
              {t(ScreenHeaderTexts.headerButton[type].text)}
            </ThemeText>
            <ThemeIcon svg={Close} color={color} />
          </View>
        ),
        accessibilityHint: t(ScreenHeaderTexts.headerButton[type].a11yHint),
        onPress: onPress || navigation.goBack,
        ...accessibilityProps,
      };
    }
    case 'custom': {
      const {text, color, onPress, ...accessibilityProps} = buttonProps;
      return {
        children: (
          <View style={styles.headerButtonContainer}>
            <ThemeText color={color}>{text}</ThemeText>
            {buttonProps.svg && (
              <ThemeIcon svg={buttonProps.svg} color={color} />
            )}
          </View>
        ),
        onPress: onPress,
        ...accessibilityProps,
      };
    }
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  headerButtonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.xSmall,
  },
}));
