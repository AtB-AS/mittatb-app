import {TouchableOpacityProperties, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Theme} from '../../../theme';

type ButtonProps = {
  onPress(): void;
  mode?: 'primary' | 'destructive' | 'secondary';
  IconComponent?: React.ElementType;
} & TouchableOpacityProperties;
const Button: React.FC<ButtonProps> = ({
  onPress,
  mode = 'primary',
  IconComponent,
  children,
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
    <TouchableOpacity onPress={onPress} {...props}>
      <View style={styleContainer}>
        {IconComponent && <IconComponent />}
        <View style={css.textContainer}>
          <Text style={styleText}>{children}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default Button;

const useButtonStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  button: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    borderRadius: 4,
    borderTopLeftRadius: 16,
    backgroundColor: theme.background.accent,
    marginBottom: 24,
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
  textContainer: {
    flex: 1,
    marginEnd: 20,
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
