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

export type LinkItemProps = SectionItem<{
  text: string;
  subtitle?: string;
  onPress?(event: GestureResponderEvent): void;
  icon?: NavigationIconTypes | JSX.Element;
  disabled?: boolean;
  accessibility?: AccessibilityProps;
}>;
export default function LinkItem({
  text,
  onPress,
  subtitle,
  icon,
  accessibility,
  disabled,
  ...props
}: LinkItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const linkItemStyle = useStyles();
  const iconEl =
    isNavigationIcon(icon) || !icon ? <NavigationIcon mode={icon} /> : icon;
  const disabledStyle = disabled ? linkItemStyle.disabled : undefined;
  return (
    <TouchableOpacity
      accessible
      accessibilityRole="link"
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{disabled}}
      style={topContainer}
      {...accessibility}
    >
      <View style={[style.spaceBetween, contentContainer, disabledStyle]}>
        <ThemeText style={linkItemStyle.text}>{text}</ThemeText>
        {iconEl}
      </View>
      {subtitle && (
        <ThemeText color="faded" type="lead">
          {subtitle}
        </ThemeText>
      )}
    </TouchableOpacity>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  disabled: {opacity: 0.2},
  text: {flex: 1},
}));
