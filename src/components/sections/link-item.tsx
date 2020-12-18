import React from 'react';
import {
  AccessibilityProps,
  GestureResponderEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import ThemeText from '../text';
import NavigationIcon, {
  isNavigationIcon,
  NavigationIconTypes,
} from '../theme-icon/navigation-icon';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

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
  const iconEl =
    isNavigationIcon(icon) || !icon ? <NavigationIcon mode={icon} /> : icon;
  const disabledStyle = disabled ? {opacity: 0.2} : undefined;
  return (
    <TouchableOpacity
      accessible
      accessibilityRole="link"
      onPress={onPress}
      disabled={disabled}
      style={topContainer}
      {...accessibility}
    >
      <View style={[style.spaceBetween, contentContainer, disabledStyle]}>
        <ThemeText>{text}</ThemeText>
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
