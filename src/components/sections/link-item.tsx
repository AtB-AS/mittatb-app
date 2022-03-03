import React from 'react';
import {
  AccessibilityProps,
  GestureResponderEvent,
  TouchableOpacity,
  View,
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
  ...props
}: LinkItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const linkItemStyle = useStyles();
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
      style={topContainer}
      testID={testID}
      {...accessibilityWithOverrides}
    >
      <View style={[style.spaceBetween, disabledStyle]}>
        <ThemeText style={contentContainer} type={textType}>
          {text}
        </ThemeText>
        {flag && (
          <View style={linkItemStyle.flag}>
            <ThemeText color="primary_2" type={'body__tertiary'}>
              {flag}
            </ThemeText>
          </View>
        )}
        {iconEl}
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
    backgroundColor: theme.colors.primary_2.backgroundColor,
    marginRight: theme.spacings.medium,
    paddingHorizontal: theme.spacings.small,
    paddingVertical: theme.spacings.xSmall,
    borderRadius: theme.border.radius.regular,
  },
}));
