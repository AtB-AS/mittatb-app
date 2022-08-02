import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileStackParams} from '..';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import SvgReorder from '@atb/assets/svg/mono-icons/actions/Reorder';
import * as Sections from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import {StoredLocationFavorite} from '@atb/favorites/types';
import MessageBox from '@atb/components/message-box';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteListTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import FullScreenHeader from '@atb/components/screen-header/full-header';

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
    <View style={style.container}>
      <FullScreenHeader
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
          {items.map((favorite, i) => (
            <Sections.FavoriteItem
              key={favorite.name + favorite.location.id}
              favorite={favorite}
              accessibility={{
                accessibilityHint: t(FavoriteListTexts.favoriteItem.a11yHint),
              }}
              onPress={navigateToEdit}
              testID={'favorite' + i}
            />
          ))}
        </Sections.Section>

        <Sections.Section withPadding>
          {!!items.length && (
            <Sections.LinkItem
              text={t(FavoriteListTexts.buttons.changeOrder)}
              onPress={onSortClick}
              icon={<ThemeIcon svg={SvgReorder} />}
              testID="changeOrderButton"
            />
          )}
          <Sections.LinkItem
            text={t(FavoriteListTexts.buttons.addFavorite)}
            onPress={onAddButtonClick}
            icon={<ThemeIcon svg={Add} />}
            testID="addFavoriteButton"
          />
        </Sections.Section>
      </ScrollView>
    </View>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
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
