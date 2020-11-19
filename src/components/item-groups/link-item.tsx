import React from 'react';
import {GestureResponderEvent, TouchableOpacity, View} from 'react-native';
import ThemeText from '../text';
import NavigationIcon, {
  isNavigationIcon,
  NavigationIconTypes,
} from '../theme-icon/navigation-icon';
import useListStyle from './style';

export type LinkItemProps = {
  text: string;
  subline?: string;
  onPress?(event: GestureResponderEvent): void;
  icon?: NavigationIconTypes | JSX.Element;
};
export default function LinkItem({
  text,
  onPress,
  subline,
  icon,
}: LinkItemProps) {
  const style = useListStyle();
  const iconEl =
    isNavigationIcon(icon) || !icon ? <NavigationIcon mode={icon} /> : icon;
  return (
    <TouchableOpacity onPress={onPress} style={style.baseItem}>
      <View style={style.action}>
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
