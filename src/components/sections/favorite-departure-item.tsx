import React from 'react';
import {
  AccessibilityProps,
  GestureResponderEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
import {StoredFavoriteDeparture} from '@atb/favorites/types';
import {useTheme} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import TransportationIcon from '@atb/components/transportation-icon';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';
import {StyleSheet, Theme} from '@atb/theme';

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
  const {t} = useTranslation();
  if (!withOnPress(props)) {
    return <FavoriteItemContent {...props} />;
  }
  const favorite = props.favorite;
  const a11yLabel = favorite.quayPublicCode
    ? `${favorite.lineLineNumber} ${
        favorite.lineName ?? t(SectionTexts.favoriteDeparture.allVariations)
      }, ${favorite.quayName} ${favorite.quayPublicCode}`
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
  const sectonStyle = useSectionStyle();
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={[sectonStyle.spaceBetween, topContainer, styles.flexStart]}>
      <View style={styles.favorite__icon}>
        <TransportationIcon
          mode={favorite.lineTransportationMode}
          subMode={favorite.lineTransportationSubMode}
        />
      </View>
      <View style={contentContainer}>
        <ThemeText>
          {favorite.lineLineNumber}{' '}
          {favorite.lineName ?? t(SectionTexts.favoriteDeparture.allVariations)}
        </ThemeText>
        <ThemeText type="body__secondary" color="secondary">
          {t(SectionTexts.favoriteDeparture.from)} {favorite.quayName}{' '}
          {favorite.quayPublicCode ?? ''}
        </ThemeText>
      </View>
      {icon ?? (
        <SvgDelete
          fill={theme.interactive.interactive_destructive.default.background}
        />
      )}
    </View>
  );
}

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  flexStart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  favorite__icon: {
    marginRight: theme.spacings.medium,
  },
}));
