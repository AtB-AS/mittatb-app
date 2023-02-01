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
import {TransportationIcon} from '@atb/components/transportation-icon';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
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

type Props = SectionItemProps<BaseProps | WithOnPress>;
export function FavoriteDepartureSectionItem(props: Props) {
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
  const sectionStyle = useSectionStyle();
  const styles = useStyles();
  const {theme} = useTheme();
  const {t} = useTranslation();

  return (
    <View style={[sectionStyle.spaceBetween, topContainer, styles.flexStart]}>
      <TransportationIcon
        style={styles.transportation__icon}
        mode={favorite.lineTransportationMode}
        subMode={favorite.lineTransportationSubMode}
      />
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
  transportation__icon: {
    marginRight: theme.spacings.medium,
  },
}));
