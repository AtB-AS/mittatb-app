import {
  TouchableOpacityProps,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import React from 'react';
import {StyleSheet, Theme, useTheme} from '../../theme';
import ThemeText from '../text';

type ButtonMode = keyof Theme['button'];
type ButtonType = 'block' | 'inline' | 'compact';

type ButtonProps = {
  onPress(): void;
  mode?: ButtonMode;
  type?: ButtonType;
  textContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
  text: string;
} & TouchableOpacityProps;
const Button: React.FC<ButtonProps> = ({
  onPress,
  mode = 'primary',
  type = 'block',
  icon: Icon,
  iconPosition = 'left',
  text,
  disabled,
  style,
  textContainerStyle,
  textStyle,
  ...props
}) => {
  const css = useButtonStyle();
  const {theme} = useTheme();
  const {backgroundColor, borderColor, textColor} = theme.button[mode];
  const isInline = type === 'compact' || type === 'inline';
  const padding =
    type === 'compact' ? theme.spacings.small : theme.spacings.medium;
  const styleContainer: ViewStyle[] = [
    css.button,
    {
      backgroundColor,
      borderColor,
      padding,
      alignSelf: isInline ? 'flex-start' : undefined,
    },
  ];
  const styleText: TextStyle = {color: textColor};
  const textContainer: TextStyle = {
    flex: isInline ? undefined : 1,
    alignItems: 'center',
  };
  const iconContainer: ViewStyle = isInline
    ? {
        position: 'relative',
        left: undefined,
        right: undefined,
        marginRight: iconPosition === 'left' ? padding : undefined,
        marginLeft: iconPosition === 'right' ? padding : undefined,
      }
    : {};

  return (
    <View style={disabled ? css.buttonDisabled : undefined}>
      <TouchableOpacity
        style={[styleContainer, style]}
        onPress={onPress}
        disabled={disabled}
        {...props}
      >
        {Icon && iconPosition === 'left' && (
          <View style={[css.leftIcon, iconContainer]}>
            <Icon fill={theme.text.colors.primary} />
          </View>
        )}
        <View style={[textContainer, textContainerStyle]}>
          <ThemeText type="paragraphHeadline" style={[styleText, textStyle]}>
            {text}
          </ThemeText>
        </View>
        {Icon && iconPosition === 'right' && (
          <View style={[css.rightIcon, iconContainer]}>
            <Icon fill={theme.text.colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    </View>
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
    marginBottom: theme.spacings.small,
    borderColor: theme.button.primary.backgroundColor,
  },
  leftIcon: {
    position: 'absolute',
    left: theme.spacings.medium,
  },
  rightIcon: {
    position: 'absolute',
    right: theme.spacings.medium,
  },
  buttonDisabled: {
    opacity: 0.2,
  },
}));
