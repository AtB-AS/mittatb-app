import {Add} from '@atb/assets/svg/mono-icons/actions';
import SvgReorder from '@atb/assets/svg/mono-icons/actions/Reorder';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {
  StoredLocationFavorite,
  useFavoritesContext,
} from '@atb/modules/favorites';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteListTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ProfileScreenProps} from './navigation-types';
import {
  FavoriteSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {FullScreenView} from '@atb/components/screen-view';
import {View} from 'react-native';
import {ScreenHeading} from '@atb/components/heading';

type Props = ProfileScreenProps<'Profile_FavoriteListScreen'>;

export const Profile_FavoriteListScreen = ({navigation}: Props) => {
  const style = useProfileStyle();
  const {favorites} = useFavoritesContext();
  const {t} = useTranslation();
  const items = favorites ?? [];

  const navigateToEdit = (item: StoredLocationFavorite) => {
    navigation.navigate('Root_AddEditFavoritePlaceScreen', {
      editItem: item,
    });
  };
  const onAddButtonClick = () =>
    navigation.push('Root_SearchFavoritePlaceScreen');
  const onSortClick = () => navigation.push('Profile_SortFavoritesScreen');

  return (
    <FullScreenView
      headerProps={{
        title: t(FavoriteListTexts.header.title),
        leftButton: {type: 'back'},
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(FavoriteListTexts.header.title)}
        />
      )}
    >
      <View style={style.container}>
        {!items?.length && (
          <MessageInfoBox
            message={t(FavoriteListTexts.noFavorites)}
            type="info"
          />
        )}

        <Section>
          {items.map((favorite, i) => (
            <FavoriteSectionItem
              key={favorite.id}
              favorite={favorite}
              accessibility={{
                accessibilityHint: t(FavoriteListTexts.favoriteItem.a11yHint),
              }}
              onPress={navigateToEdit}
              testID={'favorite' + i}
            />
          ))}
        </Section>

        <Section>
          {!!items.length && (
            <LinkSectionItem
              text={t(FavoriteListTexts.buttons.changeOrder)}
              onPress={onSortClick}
              rightIcon={{svg: SvgReorder}}
              testID="changeOrderButton"
            />
          )}
          <LinkSectionItem
            text={t(FavoriteListTexts.buttons.addFavorite)}
            onPress={onAddButtonClick}
            rightIcon={{svg: Add}}
            testID="addFavoriteButton"
          />
        </Section>
      </View>
    </FullScreenView>
  );
};
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    padding: theme.spacing.medium,
    rowGap: theme.spacing.medium,
  },
}));
