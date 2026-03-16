import {ThemeText} from '@atb/components/text';
import {
  NavigationIcon,
  isNavigationIcon,
  NavigationIconTypes,
} from '@atb/components/theme-icon';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {insets} from '@atb/utils/insets';
import React, {RefObject} from 'react';
import {AccessibilityProps, View, ViewStyle} from 'react-native';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {NativeBlockButton} from '@atb/components/native-button';

export type ButtonSectionItemProps = SectionItemProps<{
  label: string;
  onPress(): void;
  onIconPress?(): void;
  iconAccessibility?: AccessibilityProps;
  placeholder?: string;
  value?: string | React.JSX.Element;
  inlineValue?: boolean;
  highlighted?: boolean;
  icon?: NavigationIconTypes | React.JSX.Element;
  containerStyle?: ViewStyle;
  testID?: string;
  focusRef?: RefObject<any>;
}> &
  AccessibilityProps;

export function ButtonSectionItem({
  onPress,
  value,
  inlineValue = true,
  placeholder,
  label,
  highlighted,
  focusRef,

  icon,
  onIconPress,
  iconAccessibility,

  containerStyle,

  ...props
}: ButtonSectionItemProps) {
  const sectionStyles = useSectionStyle();
  const {theme} = useThemeContext();
  const {topContainer, contentContainer} = useSectionItem(props);
  const styles = useSymbolPickerStyle();
  const hasIcon = Boolean(icon);
  const iconEl = isNavigationIcon(icon) ? <NavigationIcon mode={icon} /> : icon;

  const padding = {padding: theme.spacing.medium};

  const handlerWithoutPress =
    hasIcon && !onIconPress ? (
      <View style={[styles.iconContainer, padding]}>{iconEl}</View>
    ) : undefined;

  const handlerWithPress =
    hasIcon && onIconPress ? (
      <NativeBlockButton
        hitSlop={insets.all(12)}
        onPress={onIconPress}
        style={[styles.iconContainer, padding]}
        {...iconAccessibility}
      >
        <View>{iconEl}</View>
      </NativeBlockButton>
    ) : undefined;

  const valueEl =
    isStringText(value) || !value ? (
      <ThemeText
        numberOfLines={1}
        typography={value && highlighted ? 'body__m__strong' : 'body__m'}
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
      <NativeBlockButton
        onPress={onPress}
        style={[topContainer, styles.container, containerPadding]}
        ref={focusRef}
        {...props}
      >
        <View style={sectionStyles.spaceBetween}>
          <ThemeText typography="body__s" style={styles.label}>
            {label}
          </ThemeText>
          {inlineValue && (
            <View style={[contentContainer, containerStyle]}>{valueEl}</View>
          )}
        </View>
        {!inlineValue && <View style={styles.inlineValueStyle}>{valueEl}</View>}
        {handlerWithoutPress}
      </NativeBlockButton>
      {handlerWithPress}
    </View>
  );
}

function isStringText(a: any): a is string {
  return typeof a === 'string';
}

const useSymbolPickerStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[0].background,
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
    minWidth: 60 - theme.spacing.medium,
  },
  faded: {
    color: theme.color.foreground.dynamic.secondary,
  },
  inlineValueStyle: {
    paddingTop: theme.spacing.xSmall,
  },
}));
