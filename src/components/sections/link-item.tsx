import React from 'react';
import {GestureResponderEvent, TouchableOpacity, View} from 'react-native';
import ThemeText from '../text';
import NavigationIcon, {
  isNavigationIcon,
  NavigationIconTypes,
} from '../theme-icon/navigation-icon';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

export type LinkItemProps = SectionItem<{
  text: string;
  subline?: string;
  onPress?(event: GestureResponderEvent): void;
  icon?: NavigationIconTypes | JSX.Element;
}>;
export default function LinkItem({
  text,
  onPress,
  subline,
  icon,
  ...props
}: LinkItemProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const iconEl =
    isNavigationIcon(icon) || !icon ? <NavigationIcon mode={icon} /> : icon;
  return (
    <TouchableOpacity onPress={onPress} style={[style.baseItem, topContainer]}>
      <View style={[style.spaceBetween, contentContainer]}>
        <ThemeText>{text}</ThemeText>
        {iconEl}
      </View>
      {subline && (
        <ThemeText color="faded" type="lead">
          {subline}
        </ThemeText>
      )}
    </TouchableOpacity>
  );
}
