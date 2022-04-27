import React from 'react';
import {
  AccessibilityProps,
  ColorValue,
  GestureResponderEvent,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import ThemeText from '@atb/components/text';
import NavigationIcon, {
  isNavigationIcon,
  NavigationIconTypes,
} from '@atb/components/theme-icon/navigation-icon';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {TextNames} from '@atb/theme/colors';

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
  backgroundColor?: ColorValue;
  contentColor?: ColorValue;
  overrideContainerStyles?: ViewStyle;
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
  backgroundColor,
  contentColor,
  overrideContainerStyles,
  ...props
}: LinkItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const linkItemStyle = useStyles();
  const {theme} = useTheme();
  const iconEl =
    isNavigationIcon(icon) || !icon ? <NavigationIcon mode={icon} /> : icon;
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
      style={
        backgroundColor
          ? [
              topContainer,
              {backgroundColor: backgroundColor},
              overrideContainerStyles,
            ]
          : topContainer
      }
      testID={testID}
      {...accessibilityWithOverrides}
    >
      <View style={[style.spaceBetween, disabledStyle]}>
        <ThemeText
          style={
            contentColor
              ? [contentContainer, {color: contentColor}]
              : contentContainer
          }
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
        {/* Her må vi støtte riktig farge på et vis */}
        {contentColor ? iconEl : iconEl}
      </View>
      {subtitle && (
        <ThemeText color="secondary" type="body__secondary">
          {subtitle}
        </ThemeText>
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
