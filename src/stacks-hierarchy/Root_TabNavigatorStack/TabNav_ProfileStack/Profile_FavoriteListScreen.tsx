import {Add} from '@atb/assets/svg/mono-icons/actions';
import SvgReorder from '@atb/assets/svg/mono-icons/actions/Reorder';
import {MessageBox} from '@atb/components/message-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import * as Sections from '@atb/components/sections';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import {StoredLocationFavorite} from '@atb/favorites';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteListTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ProfileScreenProps} from './navigation-types';
import {v4 as uuid} from 'uuid';

type Props = ProfileScreenProps<'Profile_FavoriteListScreen'>;

export const Profile_FavoriteListScreen = ({navigation}: Props) => {
  const style = useProfileStyle();
  const {favorites} = useFavorites();
  const {t} = useTranslation();
  const items = favorites ?? [];

  const navigateToEdit = (item: StoredLocationFavorite) => {
    navigation.navigate('Root_AddEditFavoritePlaceScreen', {
      editItem: item,
    });
  };
  const onAddButtonClick = () => navigation.push('Root_SearchStopPlaceScreen');
  const onSortClick = () => navigation.push('Profile_SortFavoritesScreen');

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(FavoriteListTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView>
        {!items?.length && (
          <MessageBox
            style={style.empty}
            message={t(FavoriteListTexts.noFavorites)}
            type="info"
          />
        )}

        <Sections.Section withTopPadding withPadding>
          {items.map((favorite, i) => (
            <Sections.FavoriteSectionItem
              key={favorite.name + favorite.location.id + uuid()}
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
            <Sections.LinkSectionItem
              text={t(FavoriteListTexts.buttons.changeOrder)}
              onPress={onSortClick}
              icon={<ThemeIcon svg={SvgReorder} />}
              testID="changeOrderButton"
            />
          )}
          <Sections.LinkSectionItem
            text={t(FavoriteListTexts.buttons.addFavorite)}
            onPress={onAddButtonClick}
            icon={<ThemeIcon svg={Add} />}
            testID="addFavoriteButton"
          />
        </Sections.Section>
      </ScrollView>
    </View>
  );
};
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
