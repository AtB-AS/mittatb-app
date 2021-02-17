import ThemeText from '@atb/components/text';
import NavigationIcon, {
  isNavigationIcon,
  NavigationIconTypes,
} from '@atb/components/theme-icon/navigation-icon';
import {StyleSheet} from '@atb/theme';
import insets from '@atb/utils/insets';
import React from 'react';
import {
  AccessibilityProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

export type ButtonInputProps = SectionItem<{
  label: string;
  onPress(): void;
  onIconPress?(): void;
  iconAccessibility?: AccessibilityProps;
  placeholder?: string;
  value?: string | JSX.Element;
  icon?: NavigationIconTypes | JSX.Element;
  containerStyle?: ViewStyle;
}> &
  AccessibilityProps;

export default function ButtonInput({
  onPress,
  value,
  placeholder,
  label,

  icon,
  onIconPress,
  iconAccessibility,

  ...props
}: ButtonInputProps) {
  const sectionStyles = useSectionStyle();
  const {topContainer, contentContainer, spacing} = useSectionItem(props);
  const styles = useSymbolPickerStyle();
  const iconEl = isNavigationIcon(icon) ? <NavigationIcon mode={icon} /> : icon;

  const wrapperStyle =
    props.type == 'compact' || props.type == 'inline'
      ? styles.wrapper__inline
      : undefined;

  const padding = {padding: spacing};

  const handlerWithoutPress = !onIconPress ? (
    <View style={[styles.iconContainer, padding]}>{iconEl}</View>
  ) : undefined;

  const handlerWithPress = onIconPress ? (
    <TouchableOpacity
      hitSlop={insets.all(12)}
      onPress={onIconPress}
      style={[styles.iconContainer, padding]}
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
        style={[topContainer, sectionStyles.spaceBetween, styles.container]}
        {...props}
      >
        <ThemeText type="lead" style={styles.label}>
          {label}
        </ThemeText>
        <View style={contentContainer}>{valueEl}</View>
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
    backgroundColor: theme.background.level0,
    paddingRight: 60,
  },
  wrapper__inline: {
    alignSelf: 'flex-start',
  },
  iconContainer: {
    position: 'absolute',
    right: 0,
  },
  label: {
    // @TODO Find a better way to do this.
    minWidth: 60 - theme.spacings.medium,
  },
  faded: {
    color: theme.text.colors.secondary,
  },
}));
