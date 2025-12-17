import React from 'react';
import {AccessibilityProps, GestureResponderEvent, View} from 'react-native';
import SvgDelete from '@atb/assets/svg/mono-icons/actions/Delete';
import {StoredFavoriteDeparture} from '@atb/modules/favorites';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {SectionTexts, useTranslation} from '@atb/translations';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {TransportationIconBox} from '@atb/components/icon-box';
import {useSectionItem} from '../use-section-item';
import {SectionItemProps} from '../types';
import {useSectionStyle} from '../use-section-style';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {formatDestinationDisplay} from '@atb/screen-components/travel-details-screens';

type BaseProps = {
  favorite: StoredFavoriteDeparture;
  icon?: React.JSX.Element;
  testID?: string;
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
  const favoriteLineName = formatDestinationDisplay(
    t,
    favorite.destinationDisplay,
  );
  const a11yLabel = favorite.quayPublicCode
    ? `${favorite.lineLineNumber} ${
        favoriteLineName ?? t(SectionTexts.favoriteDeparture.allVariations)
      }, ${favorite.quayName} ${favorite.quayPublicCode}`
    : `${favorite.lineLineNumber} ${favoriteLineName}, ${favorite.quayName}`;

  return (
    <PressableOpacity
      accessible
      accessibilityLabel={a11yLabel + screenReaderPause}
      accessibilityRole="button"
      onPress={(e) => props.onPress(props.favorite, e)}
      {...props.accessibility}
      testID={props.testID}
    >
      <FavoriteItemContent {...props} />
    </PressableOpacity>
  );
}

function withOnPress(a: any): a is WithOnPress {
  return 'onPress' in a;
}

function FavoriteItemContent({favorite, icon, ...props}: BaseProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useStyles();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  return (
    <View style={[sectionStyle.spaceBetween, topContainer, styles.flexStart]}>
      <TransportationIconBox
        style={styles.transportation__icon}
        mode={favorite.lineTransportationMode}
        subMode={favorite.lineTransportationSubMode}
      />
      <View style={contentContainer}>
        <ThemeText>
          {favorite.lineLineNumber}{' '}
          {formatDestinationDisplay(t, favorite.destinationDisplay) ??
            t(SectionTexts.favoriteDeparture.allVariations)}
        </ThemeText>
        <ThemeText typography="body__s" color="secondary">
          {t(SectionTexts.favoriteDeparture.from)} {favorite.quayName}{' '}
          {favorite.quayPublicCode ?? ''}
        </ThemeText>
      </View>
      {icon ?? (
        <SvgDelete
          fill={theme.color.interactive.destructive.default.background}
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
    marginRight: theme.spacing.medium,
  },
}));
