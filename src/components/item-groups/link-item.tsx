import React from 'react';
import {GestureResponderEvent, TouchableOpacity, View} from 'react-native';
import ThemeText from '../text';
import NavigationIcon, {
  NavigationIconTypes,
} from '../theme-icon/navigation-icon';
import useListStyle from './style';

export type LinkItemProps = {
  text: string;
  subline?: string;
  onPress?(event: GestureResponderEvent): void;
  icon?: NavigationIconTypes;
};
export default function LinkItem({
  text,
  onPress,
  subline,
  icon,
}: LinkItemProps) {
  const style = useListStyle();
  return (
    <TouchableOpacity onPress={onPress} style={style.baseItem}>
      <View style={style.action}>
        <ThemeText>{text}</ThemeText>
        <NavigationIcon mode={icon} />
      </View>
      {subline && (
        <ThemeText color="faded" type="lead">
          {subline}
        </ThemeText>
      )}
    </TouchableOpacity>
  );
}
