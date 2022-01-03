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
import {StyleSheet} from '@atb/theme';
import {TextNames} from '@atb/theme/colors';

export type LinkItemProps = SectionItem<{
  text: string;
  subtitle?: string;
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
  icon,
  accessibility,
  disabled,
  textType,
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
      {...accessibilityWithOverrides}
    >
      <View style={[style.spaceBetween, disabledStyle]}>
        <ThemeText style={contentContainer} type={textType}>
          {text}
        </ThemeText>
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

const useStyles = StyleSheet.createThemeHook(() => ({
  disabled: {opacity: 0.2},
}));
