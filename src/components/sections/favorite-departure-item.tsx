import React from 'react';
import {
  AccessibilityProps,
  GestureResponderEvent,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import SvgDelete from '@atb/assets/svg/icons/actions/Delete';
import {StoredFavoriteDeparture} from '@atb/favorites/types';
import {useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {screenReaderPause} from '../accessible-text';
import ThemeText from '@atb/components/text';
import TransportationIcon from '@atb/components/transportation-icon';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

type BaseProps = {
  favorite: StoredFavoriteDeparture;
  icon?: JSX.Element;
};
type WithOnPress = BaseProps & {
  onPress(
    favorite: StoredFavoriteDeparture,
    event: GestureResponderEvent,
  ): void;
  accessibility?: AccessibilityProps;
};

export type FavoriteDepartureItemProps = SectionItem<BaseProps | WithOnPress>;
export default function FavoriteDepartureItem(
  props: FavoriteDepartureItemProps,
) {
  if (!withOnPress(props)) {
    return <FavoriteItemContent {...props} />;
  }
  const favorite = props.favorite;
  const a11yLabel = favorite.quayPublicCode
    ? `${favorite.lineLineNumber} ${favorite.lineName}, ${favorite.quayName} ${favorite.quayPublicCode}`
    : `${favorite.lineLineNumber} ${favorite.lineName}, ${favorite.quayName}`;

  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={a11yLabel + screenReaderPause}
      accessibilityRole="button"
      onPress={(e) => props.onPress(props.favorite, e)}
      {...props.accessibility}
    >
      <FavoriteItemContent {...props} />
    </TouchableOpacity>
  );
}

function withOnPress(a: any): a is WithOnPress {
  return 'onPress' in a;
}

function FavoriteItemContent({favorite, icon, ...props}: BaseProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={[style.spaceBetween, topContainer, favoriteStyle.flexStart]}>
      <View style={favoriteStyle.favorite__icon}>
        <TransportationIcon
          mode={favorite.lineTransportationMode}
          subMode={favorite.lineTransportationSubMode}
        />
      </View>
      <View style={contentContainer}>
        <ThemeText>
          {favorite.lineLineNumber} {favorite.lineName}
        </ThemeText>
        <ThemeText type="lead" color="disabled">
          {t(SectionTexts.favoriteDeparture.from)} {favorite.quayName}{' '}
          {favorite.quayPublicCode ?? ''}
        </ThemeText>
      </View>
      {icon ?? <SvgDelete fill={theme.background.destructive} />}
    </View>
  );
}

const favoriteStyle = StyleSheet.create({
  flexStart: {
    alignItems: 'flex-start',
  },
  favorite__icon: {
    minWidth: 30,
  },
});
