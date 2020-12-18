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
import {StyleSheet, Theme, useTheme} from '../../theme';
import ThemeText from '../text';

export {default as ButtonGroup} from './group';

type ButtonMode = keyof Theme['button'];

type ButtonTypeAwareProps =
  | {text?: string; type: 'inline' | 'compact'}
  | {
      text: string;
      type?: 'block';
    };

export type ButtonProps = {
  onPress(): void;
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
  const css = useButtonStyle();
  const {theme} = useTheme();
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

  const {backgroundColor, borderColor, textColor} = theme.button[mode];
  const styleContainer: ViewStyle[] = [
    css.button,
    {
      backgroundColor,
      borderColor,
      padding: spacing,
      alignSelf: isInline ? 'flex-start' : undefined,
    },
  ];
  const styleText: TextStyle = {color: textColor};
  const textContainer: TextStyle = {
    flex: isInline ? undefined : 1,
    alignItems: 'center',
    marginLeft: leftIconSpacing,
    marginRight: rightIconSpacing,
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
        {...props}
      >
        {Icon && iconPosition === 'left' && (
          <View style={iconContainer}>
            <Icon fill={textColor} />
          </View>
        )}
        {text && (
          <View style={[textContainer, textContainerStyle]}>
            <ThemeText type="paragraphHeadline" style={[styleText, textStyle]}>
              {text}
            </ThemeText>
          </View>
        )}
        {Icon && iconPosition === 'right' && (
          <View style={iconContainer}>
            <Icon fill={textColor} />
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
    backgroundColor: theme.button.primary.backgroundColor,
    borderColor: theme.button.primary.backgroundColor,
  },
}));
