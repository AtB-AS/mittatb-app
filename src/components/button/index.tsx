import {
  TouchableOpacityProps,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextStyle,
  Animated,
  Easing,
} from 'react-native';
import React, {useRef} from 'react';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import ThemeText from '@atb/components/text';
import {ContrastColor, TextNames} from '@atb/theme/colors';

export {default as ButtonGroup} from './group';

type ThemeColor = keyof Theme['colors'];

type ButtonMode = 'primary' | 'secondary' | 'tertiary' | 'destructive';

type ButtonSettings = {
  themeColor?: ThemeColor;
  withBackground: boolean;
  visibleBorder: boolean;
};

const DefaultModeStyles: {[key in ButtonMode]: ButtonSettings} = {
  primary: {
    themeColor: 'primary_1',
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
  destructive: {
    themeColor: 'primary_destructive',
    withBackground: true,
    visibleBorder: false,
  },
};

type ButtonTypeAwareProps =
  | {text?: string; type: 'inline' | 'compact'}
  | {
      text: string;
      type?: 'block';
    };

export type ButtonProps = {
  onPress(): void;
  color?: ThemeColor;
  mode?: ButtonMode;
  viewContainerStyle?: StyleProp<ViewStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ElementType<{fill: string}>;
  iconPosition?: 'left' | 'right';
} & ButtonTypeAwareProps &
  TouchableOpacityProps;

const DISABLED_OPACITY = 0.2;

const Button: React.FC<ButtonProps> = ({
  onPress,
  color,
  mode = 'primary',
  type = 'block',
  icon: Icon,
  iconPosition = 'left',
  text,
  disabled,
  style,
  viewContainerStyle,
  textContainerStyle,
  textStyle,
  ...props
}) => {
  const modeData = DefaultModeStyles[mode];
  const themeColor = color ?? modeData.themeColor;
  const css = useButtonStyle();
  const {theme, themeName} = useTheme();
  const fadeAnim = useRef(new Animated.Value(disabled ? DISABLED_OPACITY : 1))
    .current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: disabled ? DISABLED_OPACITY : 1,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [disabled, fadeAnim]);

  const isInline = type === 'compact' || type === 'inline';

  const spacing =
    type === 'compact' ? theme.spacings.small : theme.spacings.medium;
  const leftIconSpacing = Icon && iconPosition === 'left' ? spacing : undefined;
  const rightIconSpacing =
    Icon && iconPosition === 'right' ? spacing : undefined;

  const {backgroundColor, textColorType} = themeColor
    ? theme.colors[themeColor]
    : ({
        backgroundColor: 'transparent',
        textColorType: themeName == 'dark' ? 'light' : 'dark',
      } as ContrastColor);
  const {primary} = theme.text.colorSelection[textColorType];

  const styleContainer: ViewStyle[] = [
    css.button,
    {
      backgroundColor: modeData.withBackground ? backgroundColor : undefined,
      borderColor: modeData.visibleBorder ? primary : 'transparent',
      padding: spacing,
      alignSelf: isInline ? 'flex-start' : undefined,
    },
  ];
  const styleText: TextStyle = {color: primary};
  const textContainer: TextStyle = {
    flex: isInline ? undefined : 1,
    alignItems: 'center',
    marginHorizontal: Icon && type !== 'compact' ? theme.spacings.xLarge : 0,
  };
  const iconContainer: ViewStyle = isInline
    ? {
        position: 'relative',
        left: undefined,
        right: undefined,
      }
    : {
        position: 'absolute',
        left: leftIconSpacing,
        right: rightIconSpacing,
      };

  return (
    <Animated.View style={[{opacity: fadeAnim}, viewContainerStyle]}>
      <TouchableOpacity
        style={[styleContainer, style]}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        importantForAccessibility={disabled ? 'no-hide-descendants' : 'auto'}
        accessibilityElementsHidden={!!disabled}
        {...props}
      >
        {Icon && iconPosition === 'left' && (
          <View style={iconContainer}>
            <Icon fill={primary} />
          </View>
        )}
        {text && (
          <View style={[textContainer, textContainerStyle]}>
            <ThemeText
              type={mode === 'tertiary' ? 'body' : 'paragraphHeadline'}
              style={[styleText, textStyle]}
            >
              {text}
            </ThemeText>
          </View>
        )}
        {Icon && iconPosition === 'right' && (
          <View style={iconContainer}>
            <Icon fill={primary} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};
export default Button;

const useButtonStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.border.radius.regular,
    borderWidth: theme.border.width.medium,
  },
}));
