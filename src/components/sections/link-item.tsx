import React from 'react';
import {
  AccessibilityProps,
  GestureResponderEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {
  NavigationIcon,
  isNavigationIcon,
  NavigationIconTypes,
} from '@atb/components/theme-icon';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {InteractiveColor, TextNames} from '@atb/theme/colors';

export type LinkItemProps = SectionItem<{
  text: string;
  subtitle?: string;
  /* Text for a flag that will be placed by the icon. "Beta", "New", etc. */
  flag?: string;
  onPress?(event: GestureResponderEvent): void;
  icon?: NavigationIconTypes | JSX.Element;
  disabled?: boolean;
  accessibility?: AccessibilityProps;
  textType?: TextNames;
  interactiveColor?: InteractiveColor;
}>;
export default function LinkItem({
  text,
  onPress,
  subtitle,
  flag,
  icon,
  accessibility,
  disabled,
  textType,
  testID,
  interactiveColor = 'interactive_2',
  ...props
}: LinkItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const linkItemStyle = useStyles();
  const {theme} = useTheme();
  const themeColor = theme.interactive[interactiveColor].default;
  const iconEl =
    isNavigationIcon(icon) || !icon ? (
      <NavigationIcon mode={icon} fill={themeColor.text} />
    ) : (
      icon
    );
  const disabledStyle = disabled ? linkItemStyle.disabled : undefined;
  const accessibilityWithOverrides = disabled
    ? {...accessibility, accessibilityHint: undefined}
    : accessibility;
  return (
    <TouchableOpacity
      accessible
      accessibilityRole="link"
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityState={{disabled}}
      style={[topContainer, {backgroundColor: themeColor.background}]}
      testID={testID}
      {...accessibilityWithOverrides}
    >
      <View style={[style.spaceBetween, disabledStyle]}>
        <ThemeText
          style={[contentContainer, {color: themeColor.text}]}
          type={textType}
        >
          {text}
        </ThemeText>
        {flag && (
          <View style={linkItemStyle.flag}>
            <ThemeText color="background_accent_3" type="body__tertiary">
              {flag}
            </ThemeText>
          </View>
        )}
        {iconEl}
      </View>
      {subtitle && (
        <View style={disabledStyle}>
          <ThemeText color="secondary" type="body__secondary">
            {subtitle}
          </ThemeText>
        </View>
      )}
    </TouchableOpacity>
  );
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  disabled: {opacity: 0.2},
  flag: {
    backgroundColor: theme.static.background.background_accent_3.background,
    marginRight: theme.spacings.medium,
    paddingHorizontal: theme.spacings.small,
    paddingVertical: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
  },
}));
