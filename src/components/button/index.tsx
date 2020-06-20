import {
  TouchableOpacityProperties,
  View,
  Text,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Theme} from '../../theme';

type ButtonProps = {
  onPress(): void;
  mode?: 'primary' | 'destructive' | 'secondary';
  textContainerStyle?: StyleProp<ViewStyle>;
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
  ...props
}) => {
  const css = useButtonStyle();
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
            <IconComponent />
          </View>
        )}
        <View style={[css.textContainer, textContainerStyle]}>
          <Text style={styleText}>{text}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default Button;

const useButtonStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  button: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: theme.background.accent,
    marginBottom: 8,
  },
  icon: {
    position: 'absolute',
    left: 12,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.border.primary,
  },
  buttonDestructive: {
    backgroundColor: theme.background.destructive,
    color: theme.text.destructive,
  },
  buttonDisabled: {
    opacity: 0.2,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    color: theme.text.primary,
  },
  textDestructive: {
    color: theme.text.destructive,
  },
}));
