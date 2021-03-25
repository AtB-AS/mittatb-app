import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileStackParams} from '..';
import {Add} from '@atb/assets/svg/icons/actions';
import SvgReorder from '@atb/assets/svg/icons/actions/Reorder';
import * as Sections from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import {StoredLocationFavorite} from '@atb/favorites/types';
import MessageBox from '@atb/components/message-box';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteListTexts, useTranslation} from '@atb/translations';
import ScreenHeader from '@atb/components/screen-header';

export type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'FavoriteList'
>;

type ProfileScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function FavoriteList({navigation}: ProfileScreenProps) {
  const style = useProfileStyle();
  const {favorites} = useFavorites();
  const {t} = useTranslation();
  const items = favorites ?? [];

  const navigateToEdit = (item: StoredLocationFavorite) => {
    navigation.navigate('AddEditFavorite', {
      screen: 'AddEditForm',
      params: {editItem: item},
    });
  };
  const onAddButtonClick = () =>
    navigation.push('AddEditFavorite', {
      screen: 'SearchLocation',
    });
  const onSortClick = () => navigation.push('SortableFavoriteList');

  return (
    <SafeAreaView style={style.container} edges={['right', 'top', 'left']}>
      <ScreenHeader
        title={t(FavoriteListTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView>
        {!items?.length && (
          <MessageBox
            containerStyle={style.empty}
            message={t(FavoriteListTexts.noFavorites)}
            type="info"
          />
        )}

        <Sections.Section withTopPadding withPadding>
          {items.map((favorite) => (
            <Sections.FavoriteItem
              key={favorite.name + favorite.location.id}
              favorite={favorite}
              accessibility={{
                accessibilityHint: t(FavoriteListTexts.favoriteItem.a11yHint),
              }}
              onPress={navigateToEdit}
            />
          ))}
        </Sections.Section>

        <Sections.Section withPadding>
          {!!items.length && (
            <Sections.LinkItem
              text={t(FavoriteListTexts.buttons.changeOrder)}
              onPress={onSortClick}
              icon={<ThemeIcon svg={SvgReorder} />}
            />
          )}
          <Sections.LinkItem
            text={t(FavoriteListTexts.buttons.addFavorite)}
            onPress={onAddButtonClick}
            icon={<ThemeIcon svg={Add} />}
          />
        </Sections.Section>
      </ScrollView>
    </SafeAreaView>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_2.backgroundColor,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  empty: {
    margin: theme.spacings.medium,
  },
}));
