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

const buttonModes = [
  'primary',
  'primary2',
  'primary3',
  'secondary',
  'tertiary',
  'destructive',
] as const;
type ButtonMode = typeof buttonModes[number];

type ButtonProps = {
  onPress(): void;
  mode?: ButtonMode;
  textContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
  text: string;
} & TouchableOpacityProps;
const Button: React.FC<ButtonProps> = ({
  onPress,
  mode = 'primary',
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
  const styleContainer = [
    css.button,
    {
      backgroundColor,
      borderColor,
    },
  ];
  const styleText = {color: textColor};

  return (
    <View style={disabled ? css.buttonDisabled : undefined}>
      <TouchableOpacity
        style={[styleContainer, style]}
        onPress={onPress}
        disabled={disabled}
        {...props}
      >
        {Icon && iconPosition === 'left' && (
          <View style={css.leftIcon}>
            <Icon fill={theme.text.colors.primary} />
          </View>
        )}
        <View style={[css.textContainer, textContainerStyle]}>
          <ThemeText type="paragraphHeadline" style={[styleText, textStyle]}>
            {text}
          </ThemeText>
        </View>
        {Icon && iconPosition === 'right' && (
          <View style={css.rightIcon}>
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
    padding: theme.spacings.medium,
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
  // buttonSecondary: {
  //   borderColor: theme.border.secondary,
  //   backgroundColor: 'transparent',
  //   padding: 14,
  // },
  // buttonDestructive: {
  //   backgroundColor: theme.background.destructive,
  //   color: theme.text.colors.destructive,
  // },
  buttonDisabled: {
    opacity: 0.2,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  // text: {
  //   color: theme.text.colors.primary,
  // },
  // textDestructive: {
  //   color: theme.text.colors.destructive,
  // },
}));
