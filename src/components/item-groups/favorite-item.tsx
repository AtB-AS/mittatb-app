import React from 'react';
import {GestureResponderEvent, TouchableOpacity, View} from 'react-native';
import {Edit} from '../../assets/svg/icons/actions';
import {FavoriteIcon} from '../../favorites';
import {LocationFavorite} from '../../favorites/types';
import ThemeText from '../text';
import useListStyle from './style';

export type FavoriteItemProps = {
  favorite: LocationFavorite;
  onPress?(event: GestureResponderEvent): void;
  icon?: JSX.Element;
};
export default function FavoriteItem({onPress, ...props}: FavoriteItemProps) {
  if (!onPress) {
    return <FavoriteItemContent {...props} />;
  }
  return (
    <TouchableOpacity onPress={onPress}>
      <FavoriteItemContent {...props} />
    </TouchableOpacity>
  );
}

function FavoriteItemContent({
  favorite,
  icon,
}: Omit<FavoriteItemProps, 'onPress'>) {
  const style = useListStyle();
  return (
    <View style={style.baseItem}>
      <View style={style.favorite}>
        <View style={style.favorite__emoji}>
          <FavoriteIcon favorite={favorite} />
        </View>
        <View style={style.favorite__text}>
          <ThemeText>{favorite.name ?? favorite.location.name}</ThemeText>
        </View>
        {icon ?? <Edit />}
      </View>
    </View>
  );
}
