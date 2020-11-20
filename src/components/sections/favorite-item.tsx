import React from 'react';
import {GestureResponderEvent, TouchableOpacity, View} from 'react-native';
import {Edit} from '../../assets/svg/icons/actions';
import {FavoriteIcon} from '../../favorites';
import {LocationFavorite} from '../../favorites/types';
import {StyleSheet} from '../../theme';
import ThemeText from '../text';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

export type FavoriteItemProps = SectionItem<{
  favorite: LocationFavorite;
  onPress?(event: GestureResponderEvent): void;
  icon?: JSX.Element;
}>;
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
  ...props
}: Omit<FavoriteItemProps, 'onPress'>) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();

  return (
    <View style={[style.baseItem, style.spaceBetween, topContainer]}>
      <View style={favoriteStyle.favorite__emoji}>
        <FavoriteIcon favorite={favorite} />
      </View>
      <View style={contentContainer}>
        <ThemeText>{favorite.name ?? favorite.location.name}</ThemeText>
      </View>
      {icon ?? <Edit />}
    </View>
  );
}

const favoriteStyle = StyleSheet.create({
  favorite__emoji: {
    minWidth: 30,
  },
});
