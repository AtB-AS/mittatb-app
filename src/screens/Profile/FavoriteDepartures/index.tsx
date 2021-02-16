import ScreenHeader from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import {useFavorites} from '@atb/favorites';
import {StoredFavoriteDeparture} from '@atb/favorites/types';
import MessageBox from '@atb/message-box';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Alert, LayoutAnimation} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function FavoriteDepartures() {
  const style = useProfileStyle();
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
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            removeFavoriteDeparture(item.id);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={style.container} edges={['right', 'top', 'left']}>
      <ScreenHeader
        title={t(FavoriteDeparturesTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView>
        {!favoriteDepartures.length && (
          <MessageBox
            containerStyle={style.empty}
            message={t(FavoriteDeparturesTexts.noFavorites)}
            type="info"
          />
        )}

        <Sections.Section withTopPadding withPadding>
          {favoriteDepartures.map((favorite) => (
            <Sections.FavoriteDepartureItem
              key={favorite.id}
              favorite={favorite}
              accessibility={{
                accessibilityHint: t(
                  FavoriteDeparturesTexts.favoriteItemDelete.a11yHint,
                ),
              }}
              onPress={onDeletePress}
            />
          ))}
        </Sections.Section>
      </ScrollView>
    </SafeAreaView>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  empty: {
    margin: theme.spacings.medium,
  },
}));
