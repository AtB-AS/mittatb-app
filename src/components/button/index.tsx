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
  | {text?: string; type: 'inline' | 'compact'}
  | {
      text: string;
      type?: 'block';
    };

export type ButtonProps = {
  onPress(): void;
  interactiveColor?: InteractiveColor;
  mode?: ButtonMode;
  viewContainerStyle?: StyleProp<ViewStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: ({fill}: {fill: string}) => JSX.Element;
  iconPosition?: 'left' | 'right';
  active?: boolean;
} & ButtonTypeAwareProps &
  TouchableOpacityProps;

const DISABLED_OPACITY = 0.2;

const Button = React.forwardRef<any, ButtonProps>((props, ref) => {
  const {
    onPress,
    interactiveColor = 'interactive_0',
    mode = 'primary',
    type = 'block',
    icon: Icon,
    iconPosition = 'left',
    text,
    disabled,
    active,
    style,
    viewContainerStyle,
    textContainerStyle,
    textStyle,
    ...otherProps
  } = props;
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

  const isInline = type === 'compact' || type === 'inline';

  const spacing =
    type === 'compact' ? theme.spacings.small : theme.spacings.medium;
  const leftIconSpacing = Icon && iconPosition === 'left' ? spacing : undefined;
  const rightIconSpacing =
    Icon && iconPosition === 'right' ? spacing : undefined;

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
  const styleText: TextStyle = {color: textColor};
  const textContainer: TextStyle = {
    flex: isInline ? undefined : 1,
    alignItems: 'center',
    marginHorizontal: Icon && !isInline ? theme.spacings.xLarge : 0,
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
        onPress={disabled ? undefined : onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{disabled: !!disabled}}
        ref={ref}
        {...otherProps}
      >
        {Icon && iconPosition === 'left' && (
          <View style={iconContainer}>
            <ThemeIcon svg={Icon} fill={textColor} />
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
        {Icon && iconPosition === 'right' && (
          <View style={iconContainer}>
            <ThemeIcon svg={Icon} fill={textColor} />
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
});
export default Button;

const useButtonStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.border.radius.regular,
    borderWidth: theme.border.width.medium,
  },
}));
