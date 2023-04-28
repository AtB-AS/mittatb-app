import {useFavorites} from '@atb/favorites';
import {StoredFavoriteDeparture} from '@atb/favorites';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {FullScreenHeader} from '@atb/components/screen-header';
import {animateNextChange} from '@atb/utils/animation';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  FavoriteDepartureSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';

type Props = {onPressAddFavorite: () => void};

export const FavoriteDeparturesScreenComponent = ({
  onPressAddFavorite,
}: Props) => {
  const style = useStyles();
  const {favoriteDepartures, removeFavoriteDeparture} = useFavorites();
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
    <View style={style.container}>
      <FullScreenHeader
        title={t(FavoriteDeparturesTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView>
        <Section withFullPadding testID="favoritesList">
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
        <Section withPadding>
          <LinkSectionItem
            text={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
            onPress={onPressAddFavorite}
            testID="addFavoriteDeparture"
            icon={<ThemeIcon svg={Add} />}
          />
        </Section>
      </ScrollView>
    </View>
  );
};
const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_2.background,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  empty: {
    margin: theme.spacings.medium,
  },
}));
