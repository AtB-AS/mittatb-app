import ThemeText from '@atb/components/text';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {InteractiveColor} from '@atb/theme/colors';
import React, {useRef} from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import ThemeIcon from '@atb/components/theme-icon/theme-icon';

export {default as ButtonGroup} from './group';

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
  | {text?: string; type: 'inline'}
  | {text: string; type?: 'block'};

type ButtonIconProps = {
  svg: ({fill}: {fill: string}) => JSX.Element;
  size?: keyof Theme['icon']['size'];
};

export type ButtonProps = {
  onPress(): void;
  interactiveColor?: InteractiveColor;
  mode?: ButtonMode;
  viewContainerStyle?: StyleProp<ViewStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: ButtonIconProps;
  rightIcon?: ButtonIconProps;
  active?: boolean;
  compact?: boolean;
} & ButtonTypeAwareProps &
  TouchableOpacityProps;

const DISABLED_OPACITY = 0.2;

const Button = React.forwardRef<any, ButtonProps>(
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
      active,
      compact = false,
      style,
      viewContainerStyle,
      textContainerStyle,
      textStyle,
      ...props
    },
    ref,
  ) => {
    const modeData = DefaultModeStyles[mode];
    const themeColor = interactiveColor;
    const css = useButtonStyle();
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

    const isInline = type === 'inline';

    const spacing = compact ? theme.spacings.small : theme.spacings.medium;

    const {background: backgroundColor, text: textColor} = themeColor
      ? theme.interactive[themeColor][active ? 'active' : 'default']
      : {
          background: 'transparent',
          text: theme.text.colors.primary,
        };

    const styleContainer: ViewStyle[] = [
      css.button,
      {
        backgroundColor: modeData.withBackground ? backgroundColor : undefined,
        borderColor: modeData.visibleBorder ? textColor : 'transparent',
        padding: spacing,
        alignSelf: isInline ? 'flex-start' : undefined,
      },
    ];

    const textMarginHorizontal = useTextMarginHorizontal(
      isInline,
      leftIcon,
      rightIcon,
    );

    const styleText: TextStyle = {color: textColor};
    const textContainer: TextStyle = {
      flex: isInline ? undefined : 1,
      alignItems: 'center',
      marginHorizontal: textMarginHorizontal,
    };
    const leftStyling: ViewStyle = {
      position: isInline ? 'relative' : 'absolute',
      left: isInline ? undefined : spacing,
      marginRight: isInline ? theme.spacings.xSmall : undefined,
    };

    const rightStyling: ViewStyle = {
      position: isInline ? 'relative' : 'absolute',
      right: isInline ? undefined : spacing,
      marginLeft: isInline ? theme.spacings.xSmall : undefined,
    };

    return (
      <Animated.View style={[{opacity: fadeAnim}, viewContainerStyle]}>
        <TouchableOpacity
          style={[styleContainer, style]}
          onPress={disabled ? undefined : onPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{disabled: !!disabled}}
          ref={ref}
          {...props}
        >
          {leftIcon && (
            <View style={leftStyling}>
              <ThemeIcon
                svg={leftIcon.svg}
                fill={textColor}
                size={leftIcon.size}
              />
            </View>
          )}
          {text && (
            <View style={[textContainer, textContainerStyle]}>
              <ThemeText
                type={
                  mode === 'tertiary' ? 'body__primary' : 'body__primary--bold'
                }
                style={[styleText, textStyle]}
              >
                {text}
              </ThemeText>
            </View>
          )}
          {rightIcon && (
            <View style={rightStyling}>
              <ThemeIcon
                svg={rightIcon.svg}
                fill={textColor}
                size={rightIcon.size}
              />
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  },
);
export default Button;

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
    borderRadius: theme.border.radius.regular,
    borderWidth: theme.border.width.medium,
  },
}));
