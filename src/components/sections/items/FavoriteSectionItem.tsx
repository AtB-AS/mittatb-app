import React from 'react';
import {AccessibilityProps, View} from 'react-native';
import {Edit} from '@atb/assets/svg/mono-icons/actions';
import {FavoriteIcon} from '@atb/modules/favorites';
import {StoredLocationFavorite} from '@atb/modules/favorites';
import {StyleSheet} from '@atb/theme';
import {screenReaderPause} from '@atb/components/text';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {NativeButton} from '@atb/components/native-button';

type BaseProps = {
  favorite: StoredLocationFavorite;
  icon?: React.JSX.Element;
  testID?: string;
};
type WithOnPress = BaseProps & {
  onPress(favorite: StoredLocationFavorite): void;
  accessibility?: AccessibilityProps;
};

type Props = SectionItemProps<BaseProps | WithOnPress>;
export function FavoriteSectionItem(props: Props) {
  if (!withOnPress(props)) {
    return <FavoriteItemContent {...props} />;
  }
  const favorite = props.favorite;
  const a11yLabel =
    favorite.name && favorite.name !== favorite.location.name
      ? `${favorite.name}, ${favorite.location.name}`
      : favorite.location.name;
  return (
    <NativeButton
      accessible
      accessibilityLabel={a11yLabel + screenReaderPause}
      accessibilityRole="button"
      onPress={() => props.onPress(props.favorite)}
      testID={props.testID}
      {...props.accessibility}
    >
      <FavoriteItemContent {...props} />
    </NativeButton>
  );
}

function withOnPress(a: any): a is WithOnPress {
  return 'onPress' in a;
}

function FavoriteItemContent({favorite, icon, testID, ...props}: BaseProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();

  return (
    <View style={[style.spaceBetween, topContainer]}>
      <View style={favoriteStyle.favorite__emoji}>
        <FavoriteIcon favorite={favorite} />
      </View>
      <View style={contentContainer}>
        <ThemeText testID={testID + 'Name'}>
          {favorite.name ?? favorite.location.name}
        </ThemeText>
      </View>
      {icon ?? <ThemeIcon svg={Edit} />}
    </View>
  );
}

const favoriteStyle = StyleSheet.create({
  favorite__emoji: {
    minWidth: 30,
  },
});
