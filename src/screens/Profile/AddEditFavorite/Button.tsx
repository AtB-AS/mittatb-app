import {TouchableOpacityProperties, View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Theme} from '../../../theme';

type ButtonProps = {
  onPress(): void;
  secondary?: boolean;
  IconComponent?: React.ElementType;
} & TouchableOpacityProperties;
const Button: React.FC<ButtonProps> = ({
  onPress,
  secondary = false,
  IconComponent,
  children,
  ...props
}) => {
  const css = useButtonStyle();
  return (
    <TouchableOpacity onPress={onPress} {...props}>
      <View style={[css.button, secondary ? css.buttonSecondary : undefined]}>
        {IconComponent && <IconComponent />}
        <View style={css.textContainer}>
          <Text style={css.text}>{children}</Text>
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
  textContainer: {
    flex: 1,
    marginEnd: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
  },
}));
