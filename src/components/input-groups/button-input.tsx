import React from 'react';
import {
  AccessibilityProps,
  ImageStyle,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {StyleSheet} from '../../theme';
import insets from '../../utils/insets';
import ThemeText from '../text';
import NavigationIcon, {
  isNavigationIcon,
  NavigationIconTypes,
} from '../theme-icon/navigation-icon';

export type ButtonInputProps = {
  label: string;
  onPress(): void;
  onIconPress?(): void;
  iconAccessibility?: AccessibilityProps;
  placeholder?: string;
  value?: string | JSX.Element;
  icon?: NavigationIconTypes | JSX.Element;
  type?: 'inline' | 'block';
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
} & AccessibilityProps;

export default function ButtonInput({
  onPress,
  value,
  placeholder,
  label,

  icon,
  onIconPress,
  iconAccessibility,

  style,
  type = 'block',
  ...props
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

  const handlerWithoutPress = !onIconPress ? (
    <View style={styles.iconContainer}>{iconEl}</View>
  ) : undefined;

  const handlerWithPress = onIconPress ? (
    <TouchableOpacity
      hitSlop={insets.all(12)}
      onPress={onIconPress}
      style={styles.iconContainer}
      {...iconAccessibility}
    >
      <View>{iconEl}</View>
    </TouchableOpacity>
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
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, style]}
        {...props}
      >
        <View style={valueStyle}>{valueEl}</View>
        <ThemeText type="lead" style={styles.label}>
          {label}
        </ThemeText>
        {handlerWithoutPress}
      </TouchableOpacity>
      {handlerWithPress}
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
    backgroundColor: theme.background.level0,
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
