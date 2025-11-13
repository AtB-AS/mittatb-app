import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useFavoritesContext} from '@atb/modules/favorites';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteListTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {SortableList} from './SortableList';

export const Profile_SortFavoritesScreen = () => {
  const styles = useStyles();
  const {favorites, setFavoriteLocations: setFavorites} = useFavoritesContext();
  const items = favorites ?? [];
  const [sortedItems, setSortedItems] = useState(items);
  const [error, setError] = useState(false);
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(FavoriteListTexts.sortableScreen.title)}
        leftButton={{type: 'back'}}
      />
      {error && (
        <MessageInfoBox
          type="error"
          message={t(FavoriteListTexts.sortableScreen.messages.error)}
          style={styles.error}
        />
      )}
      <SortableList
        data={sortedItems}
        onSort={(newData) => {
          setSortedItems(newData);
          setFavorites(newData)
            .then(() => setError(false))
            .catch(() => setError(true));
        }}
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[1].background,
    flex: 1,
  },
  error: {
    margin: theme.spacing.medium,
  },
}));
