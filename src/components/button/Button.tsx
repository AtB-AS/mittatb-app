import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';
import React, {useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  PressableProps,
  StyleProp,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {ThemeIcon, ThemeIconProps} from '@atb/components/theme-icon';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {shadows} from '@atb/components/map';

type ButtonMode = 'primary' | 'secondary' | 'tertiary';

type ButtonSettings = {
  withBackground: boolean;
  visibleBorder: boolean;
};

const DefaultModeStyles: {[key in ButtonMode]: ButtonSettings} = {
  primary: {
    withBackground: true,
    visibleBorder: false,
  },
  secondary: {
    withBackground: false,
    visibleBorder: true,
  },
  tertiary: {
    withBackground: false,
    visibleBorder: false,
  },
};

type ButtonTypeAwareProps =
  | {text: string; type?: 'block'}
  | {text?: string; type: 'inline'}
  | {text: string; type: 'pill'};

type ButtonModeAwareProps =
  | {active?: boolean; mode?: 'primary'}
  | {mode: Exclude<ButtonMode, 'primary'>};

type ButtonIconProps = {
  svg: ({fill}: {fill: string}) => JSX.Element;
  size?: keyof Theme['icon']['size'];
  notification?: ThemeIconProps['notification'];
};

export type ButtonProps = {
  onPress(): void;
  interactiveColor?: InteractiveColor;
  leftIcon?: ButtonIconProps;
  rightIcon?: ButtonIconProps;
  compact?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  hasShadow?: boolean;
} & ButtonModeAwareProps &
  ButtonTypeAwareProps &
  PressableProps;

const DISABLED_OPACITY = 0.2;

export const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      onPress,
      interactiveColor = 'interactive_0',
      mode = 'primary',
      type = 'block',
      leftIcon,
      rightIcon,
      text,
      disabled,
      loading = false,
      compact = false,
      hasShadow = false,
      style,
      ...props
    },
    ref,
  ) => {
    const isActive = 'active' in props && props.active;

    const modeData = DefaultModeStyles[mode];
    const themeColor = interactiveColor;
    const styles = useButtonStyle();
    const {theme} = useTheme();
    const fadeAnim = useRef(
      new Animated.Value(disabled ? DISABLED_OPACITY : 1),
    ).current;

    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: disabled ? DISABLED_OPACITY : 1,
        duration: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, [disabled, fadeAnim]);

    const isInline = type === 'inline' || type === 'pill';

    const spacing = compact ? theme.spacings.small : theme.spacings.medium;
    const {background: backgroundColor} =
      theme.interactive[themeColor][isActive ? 'active' : 'default'];

    const {text: textColor} =
      mode === 'primary'
        ? theme.interactive[themeColor][isActive ? 'active' : 'default']
        : theme.interactive[themeColor]['active'];

    const borderColor =
      isActive && mode === 'primary'
        ? theme.interactive[themeColor].default.background
        : modeData.visibleBorder
        ? textColor
        : 'transparent';

    const styleContainer: ViewStyle[] = [
      styles.button,
      {
        backgroundColor: modeData.withBackground
          ? backgroundColor
          : 'transparent',
        borderColor: borderColor,
        paddingHorizontal: spacing,
        paddingVertical: type === 'pill' ? theme.spacings.xSmall : spacing,
        alignSelf: isInline ? 'flex-start' : undefined,
        borderRadius:
          type === 'pill'
            ? theme.border.radius.circle
            : theme.border.radius.regular,
      },
    ];

    const textMarginHorizontal = useTextMarginHorizontal(
      isInline,
      leftIcon,
      rightIcon,
    );

    const styleText: TextStyle = {
      color: textColor,
      width: isInline ? '100%' : undefined,
    };
    const textContainer: TextStyle = {
      flex: isInline ? undefined : 1,
      alignItems: 'center',
      marginHorizontal: textMarginHorizontal,
      flexShrink: isInline ? 1 : undefined,
    };
    const leftStyling: ViewStyle = {
      position: isInline ? 'relative' : 'absolute',
      left: isInline ? undefined : spacing,
      marginRight:
        isInline && (text || rightIcon) ? theme.spacings.xSmall : undefined,
    };

    const rightStyling: ViewStyle = {
      position: isInline ? 'relative' : 'absolute',
      right: isInline ? undefined : spacing,
      marginLeft:
        isInline && (text || leftIcon) ? theme.spacings.xSmall : undefined,
    };

    return (
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
          },
          style,
        ]}
      >
        <PressableOpacity
          style={[styleContainer, hasShadow ? shadows : undefined]}
          onPress={disabled ? undefined : onPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{disabled: !!disabled}}
          ref={ref}
          {...props}
        >
          {leftIcon && (
            <View style={leftStyling}>
              <ThemeIcon fill={textColor} {...leftIcon} />
            </View>
          )}
          {text && (
            <View style={textContainer}>
              <ThemeText type={getTextType(mode, type)} style={styleText}>
                {text}
              </ThemeText>
            </View>
          )}
          {(rightIcon || loading) && (
            <View style={rightStyling}>
              {loading ? (
                <ActivityIndicator size="small" color={styleText.color} />
              ) : (
                rightIcon && <ThemeIcon fill={textColor} {...rightIcon} />
              )}
            </View>
          )}
        </PressableOpacity>
      </Animated.View>
    );
  },
);

/**
 * Get the extra horizontal margin for the button text. This is for normal
 * "block" type (not inline) buttons as the icons are placed with absolute
 * position, to not offset the centering of the text. This method calculates the
 * necessary horizontal margin based on the largest icon size.
 */
const useTextMarginHorizontal = (
  isInline: boolean,
  leftIcon?: ButtonIconProps,
  rightIcon?: ButtonIconProps,
) => {
  const {theme} = useTheme();
  if (isInline) return 0;
  if (!leftIcon && !rightIcon) return 0;
  const maxIconSize = Math.max(
    theme.icon.size[leftIcon?.size || 'normal'],
    theme.icon.size[rightIcon?.size || 'normal'],
  );
  return maxIconSize + theme.spacings.xSmall;
};

const useButtonStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: theme.border.width.medium,
  },
}));

function getTextType(mode: string, type: string) {
  if (mode === 'tertiary') return 'body__primary';
  if (type === 'pill') return 'body__secondary';
  return 'body__primary--bold';
}
