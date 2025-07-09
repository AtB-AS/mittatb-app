import {useFavoritesContext} from '@atb/modules/favorites';
import {StoredFavoriteDeparture} from '@atb/modules/favorites';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Alert, View} from 'react-native';
import {animateNextChange} from '@atb/utils/animation';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  FavoriteDepartureSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';

type Props = {onPressAddFavorite: () => void};

export const FavoriteDeparturesScreenComponent = ({
  onPressAddFavorite,
}: Props) => {
  const style = useStyles();
  const {favoriteDepartures, removeFavoriteDeparture} = useFavoritesContext();
  const {t} = useTranslation();
  const onDeletePress = (item: StoredFavoriteDeparture) => {
    Alert.alert(
      t(FavoriteDeparturesTexts.delete.label),
      t(FavoriteDeparturesTexts.delete.confirmWarning),
      [
        {
          text: t(FavoriteDeparturesTexts.delete.cancel),
          style: 'cancel',
        },
        {
          text: t(FavoriteDeparturesTexts.delete.delete),
          style: 'destructive',
          onPress: async () => {
            animateNextChange();
            removeFavoriteDeparture(item.id);
          },
        },
      ],
    );
  };

  return (
    <FullScreenView
      headerProps={{
        title: t(FavoriteDeparturesTexts.header.title),
        leftButton: {type: 'back', withIcon: true},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(FavoriteDeparturesTexts.header.title)}
        />
      )}
    >
      <View style={style.container}>
        <Section testID="favoritesList">
          {favoriteDepartures.map((favorite) => (
            <FavoriteDepartureSectionItem
              key={favorite.id}
              favorite={favorite}
              accessibility={{
                accessibilityHint: t(
                  FavoriteDeparturesTexts.favoriteItemDelete.a11yHint,
                ),
              }}
              onPress={onDeletePress}
              testID={`deleteFavorite${favoriteDepartures.indexOf(favorite)}`}
            />
          ))}
        </Section>
        <Section>
          <LinkSectionItem
            text={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
            onPress={onPressAddFavorite}
            testID="addFavoriteDeparture"
            icon={{svg: Add}}
          />
        </Section>
      </View>
    </FullScreenView>
  );
};
const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    margin: theme.spacing.medium,
    rowGap: theme.spacing.medium,
  },
}));
