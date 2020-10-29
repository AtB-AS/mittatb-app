import {
  TouchableOpacityProperties,
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import React from 'react';
import {StyleSheet, Theme, useTheme} from '../../theme';

type ButtonProps = {
  onPress(): void;
  mode?: 'primary' | 'destructive' | 'secondary';
  textContainerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  IconComponent?: React.ElementType;
  text: string;
} & TouchableOpacityProperties;
const Button: React.FC<ButtonProps> = ({
  onPress,
  mode = 'primary',
  IconComponent,
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
        {IconComponent && (
          <View style={css.icon}>
            <IconComponent fill={theme.text.colors.primary} />
          </View>
        )}
        <View style={[css.textContainer, textContainerStyle]}>
          <Text style={[styleText, textStyle]}>{text}</Text>
        </View>
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
    borderRadius: theme.border.borderRadius.regular,
    backgroundColor: theme.button.primary.bg,
    marginBottom: theme.spacings.small,
  },
  icon: {
    position: 'absolute',
    left: theme.spacings.medium,
  },
  buttonSecondary: {
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
    fontSize: theme.text.sizes.body,
    lineHeight: theme.text.lineHeight.body,
    fontWeight: '600',
    color: theme.text.colors.primary,
  },
  textDestructive: {
    color: theme.text.colors.destructive,
  },
}));
