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
  subLabel?: string;
  onPress(): void;
  onIconPress?(): void;
  iconAccessibility?: AccessibilityProps;
  placeholder?: string;
  value?: string | JSX.Element;
  highlighted?: boolean;
  icon?: NavigationIconTypes | JSX.Element;
  containerStyle?: ViewStyle;
  testID?: string;
}> &
  AccessibilityProps;

export default function ButtonInput({
  onPress,
  value,
  placeholder,
  label,
  subLabel,
  highlighted,

  icon,
  onIconPress,
  iconAccessibility,

  containerStyle,

  ...props
}: ButtonInputProps) {
  const sectionStyles = useSectionStyle();
  const {topContainer, contentContainer, spacing} = useSectionItem(props);
  const styles = useSymbolPickerStyle();
  const hasIcon = Boolean(icon);
  const iconEl = isNavigationIcon(icon) ? <NavigationIcon mode={icon} /> : icon;

  const wrapperStyle =
    props.type == 'compact' || props.type == 'inline'
      ? styles.wrapper__inline
      : undefined;

  const padding = {padding: spacing};

  const handlerWithoutPress =
    hasIcon && !onIconPress ? (
      <View style={[styles.iconContainer, padding]}>{iconEl}</View>
    ) : undefined;

  const handlerWithPress =
    hasIcon && onIconPress ? (
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
      <ThemeText
        numberOfLines={1}
        type={value && highlighted ? 'body__primary--bold' : 'body__primary'}
        style={!value && styles.faded}
      >
        {value ?? placeholder}
      </ThemeText>
    ) : (
      value
    );

  const subLabelEl = subLabel && (
    <ThemeText
      color="primary"
      type="body__primary--bold"
      style={styles.subLabelStyle}
    >
      {subLabel}
    </ThemeText>
  );

  const containerPadding = hasIcon ? {paddingRight: 60} : undefined;

  return (
    <View style={wrapperStyle}>
      <TouchableOpacity
        onPress={onPress}
        style={[topContainer, styles.container, containerPadding]}
        {...props}
      >
        <View style={sectionStyles.spaceBetween}>
          <ThemeText type="body__secondary" style={styles.label}>
            {label}
          </ThemeText>
          <View style={[contentContainer, containerStyle]}>{valueEl}</View>
        </View>
        {subLabelEl}
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
    backgroundColor: theme.colors.background_0.backgroundColor,
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
  subLabelStyle: {
    paddingTop: theme.spacings.xSmall,
  },
}));
