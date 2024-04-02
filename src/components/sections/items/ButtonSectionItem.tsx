import {ThemeText} from '@atb/components/text';
import {
  NavigationIcon,
  isNavigationIcon,
  NavigationIconTypes,
} from '@atb/components/theme-icon';
import {StyleSheet} from '@atb/theme';
import {insets} from '@atb/utils/insets';
import React from 'react';
import {AccessibilityProps, View, ViewStyle} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {PressableOpacity} from '@atb/components/pressable-opacity';

export type ButtonSectionItemProps = SectionItemProps<{
  label: string;
  onPress(): void;
  onIconPress?(): void;
  iconAccessibility?: AccessibilityProps;
  placeholder?: string;
  value?: string | JSX.Element;
  inlineValue?: boolean;
  highlighted?: boolean;
  icon?: NavigationIconTypes | JSX.Element;
  containerStyle?: ViewStyle;
  testID?: string;
}> &
  AccessibilityProps;

export function ButtonSectionItem({
  onPress,
  value,
  inlineValue = true,
  placeholder,
  label,
  highlighted,

  icon,
  onIconPress,
  iconAccessibility,

  containerStyle,

  ...props
}: ButtonSectionItemProps) {
  const sectionStyles = useSectionStyle();
  const {topContainer, contentContainer, spacing} = useSectionItem(props);
  const styles = useSymbolPickerStyle();
  const hasIcon = Boolean(icon);
  const iconEl = isNavigationIcon(icon) ? <NavigationIcon mode={icon} /> : icon;

  const padding = {padding: spacing};

  const handlerWithoutPress =
    hasIcon && !onIconPress ? (
      <View style={[styles.iconContainer, padding]}>{iconEl}</View>
    ) : undefined;

  const handlerWithPress =
    hasIcon && onIconPress ? (
      <PressableOpacity
        hitSlop={insets.all(12)}
        onPress={onIconPress}
        style={[styles.iconContainer, padding]}
        {...iconAccessibility}
      >
        <View>{iconEl}</View>
      </PressableOpacity>
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

  const containerPadding = hasIcon ? {paddingRight: 60} : undefined;

  return (
    <View>
      <PressableOpacity
        onPress={onPress}
        style={[topContainer, styles.container, containerPadding]}
        {...props}
      >
        <View style={sectionStyles.spaceBetween}>
          <ThemeText type="body__secondary" style={styles.label}>
            {label}
          </ThemeText>
          {inlineValue && (
            <View style={[contentContainer, containerStyle]}>{valueEl}</View>
          )}
        </View>
        {!inlineValue && <View style={styles.inlineValueStyle}>{valueEl}</View>}
        {handlerWithoutPress}
      </PressableOpacity>
      {handlerWithPress}
    </View>
  );
}

function isStringText(a: any): a is string {
  return typeof a === 'string';
}

const useSymbolPickerStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_0.background,
  },
  wrapper__inline: {
    alignSelf: 'flex-start',
  },
  iconContainer: {
    position: 'absolute',
    justifyContent: 'center',
    right: 0,
    top: 0,
    bottom: 0,
  },
  label: {
    // @TODO Find a better way to do this.
    minWidth: 60 - theme.spacings.medium,
  },
  faded: {
    color: theme.text.colors.secondary,
  },
  inlineValueStyle: {
    paddingTop: theme.spacings.xSmall,
  },
}));
