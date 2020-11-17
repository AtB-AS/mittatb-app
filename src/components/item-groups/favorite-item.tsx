import React from 'react';
import {GestureResponderEvent, TouchableOpacity, View} from 'react-native';
import {Edit} from '../../assets/svg/icons/actions';
import {FavoriteIcon} from '../../favorites';
import {LocationFavorite} from '../../favorites/types';
import ThemeText from '../text';
import NavigationIcon, {
  NavigationIconTypes,
} from '../theme-icon/navigation-icon';
import useListStyle from './style';

export type FavoriteItemProps = {
  favorite: LocationFavorite;
  onPress?(event: GestureResponderEvent): void;
  icon?: JSX.Element;
};
export default function FavoriteItem({
  favorite,
  onPress,
  icon,
}: FavoriteItemProps) {
  const style = useListStyle();
  return (
    <TouchableOpacity onPress={onPress} style={style.baseItem}>
      <View style={style.favorite}>
        <View style={style.favorite__emoji}>
          <FavoriteIcon favorite={favorite} />
        </View>
        <View style={style.favorite__text}>
          <ThemeText>{favorite.name ?? favorite.location.name}</ThemeText>
        </View>
        {icon ?? <Edit />}
      </View>
    </TouchableOpacity>
  );
}

function isNavigationIcon(a: any): a is NavigationIconTypes {
  return typeof a === 'string' || !a;
}
