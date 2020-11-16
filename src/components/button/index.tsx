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

type ButtonProps = {
  onPress(): void;
  mode?: 'primary' | 'destructive' | 'secondary';
  textContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  leftIcon?: React.ElementType;
  rightIcon?: React.ElementType;
  text: string;
} & TouchableOpacityProps;
const Button: React.FC<ButtonProps> = ({
  onPress,
  mode = 'primary',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  text,
  disabled,
  style,
  textContainerStyle,
  textStyle,
  ...props
}) => {
  const css = useButtonStyle();
  const {theme} = useTheme();
  const styleContainer = [
    css.button,
    mode === 'secondary' ? css.buttonSecondary : undefined,
    mode === 'destructive' ? css.buttonDestructive : undefined,
  ];
  const styleText = [
    css.text,
    mode === 'destructive' ? css.textDestructive : undefined,
  ];

  return (
    <View style={disabled ? css.buttonDisabled : undefined}>
      <TouchableOpacity
        style={[styleContainer, style]}
        onPress={onPress}
        disabled={disabled}
        {...props}
      >
        {LeftIcon && (
          <View style={css.leftIcon}>
            <LeftIcon fill={theme.text.colors.primary} />
          </View>
        )}
        <View style={[css.textContainer, textContainerStyle]}>
          <ThemeText type="paragraphHeadline" style={[styleText, textStyle]}>
            {text}
          </ThemeText>
        </View>
        {RightIcon && (
          <View style={css.rightIcon}>
            <RightIcon fill={theme.text.colors.primary} />
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
    backgroundColor: theme.button.primary.bg,
    marginBottom: theme.spacings.small,
    borderColor: theme.button.primary.bg,
  },
  leftIcon: {
    position: 'absolute',
    left: theme.spacings.medium,
  },
  rightIcon: {
    position: 'absolute',
    right: theme.spacings.medium,
  },
  buttonSecondary: {
    borderColor: theme.border.secondary,
    backgroundColor: 'transparent',
    padding: 14,
  },
  buttonDestructive: {
    backgroundColor: theme.background.destructive,
    color: theme.text.colors.destructive,
  },
  buttonDisabled: {
    opacity: 0.2,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    color: theme.text.colors.primary,
  },
  textDestructive: {
    color: theme.text.colors.destructive,
  },
}));
