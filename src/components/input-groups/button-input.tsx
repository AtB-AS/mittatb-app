import React from 'react';
import {
  ImageStyle,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {StyleSheet} from '../../theme';
import ThemeText from '../text';
import NavigationIcon, {
  isNavigationIcon,
  NavigationIconTypes,
} from '../theme-icon/navigation-icon';

type ButtonInputProps = {
  label: string;
  onPress(): void;
  onHandlerPress?(): void;
  placeholder?: string;
  value?: string | JSX.Element;
  icon?: NavigationIconTypes | JSX.Element;
  type?: 'inline' | 'block';
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
};
export default function ButtonInput({
  onPress,
  onHandlerPress,
  value,
  placeholder,
  label,
  icon,
  style,
  type = 'block',
}: ButtonInputProps) {
  const styles = useSymbolPickerStyle();
  const iconEl = isNavigationIcon(icon) ? <NavigationIcon mode={icon} /> : icon;

  const wrapperStyle = [
    styles.wrapper,
    type == 'inline' ? styles.wrapper__inline : undefined,
  ];
  const valueStyle = [
    styles.value,
    type == 'inline' ? styles.value__inline : undefined,
  ];

  const handlerInBody = !onHandlerPress ? (
    <View style={styles.iconContainer}>{iconEl}</View>
  ) : undefined;

  const handlerOutOfBody = onHandlerPress ? (
    <View style={styles.iconContainer}>{iconEl}</View>
  ) : undefined;

  const valueEl =
    isStringText(value) || !value ? (
      <ThemeText type="body" style={!value && styles.faded}>
        {value ?? placeholder}
      </ThemeText>
    ) : (
      value
    );

  return (
    <View style={wrapperStyle}>
      <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
        <View style={valueStyle}>{valueEl}</View>
        <ThemeText type="lead" style={styles.label}>
          {label}
        </ThemeText>
        {handlerInBody}
      </TouchableOpacity>
      {handlerOutOfBody}
    </View>
  );
}

function isStringText(a: any): a is string {
  return typeof a === 'string';
}

const useSymbolPickerStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.spacings.medium,
    // @TODO Better way to do this.
    paddingLeft: 60,
    paddingRight: 60,
    flexDirection: 'row',
    backgroundColor: theme.background.level1,
    borderRadius: theme.border.radius.regular,
  },
  wrapper: {},
  wrapper__inline: {
    alignSelf: 'flex-start',
  },
  value: {
    flex: 1,
  },
  value__inline: {
    flex: 0,
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
    padding: theme.spacings.medium,
  },
  label: {
    position: 'absolute',
    left: 0,
    padding: theme.spacings.medium,
  },
  faded: {
    color: theme.text.colors.faded,
  },
}));
