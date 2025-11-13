import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import {Button} from '@atb/components/button';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {FullScreenHeader} from '@atb/components/screen-header';
import {useFavoritesContext} from '@atb/modules/favorites';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {FavoriteListTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ProfileScreenProps} from '../navigation-types';
import {SortableList} from './SortableList';

type Props = ProfileScreenProps<'Profile_SortFavoritesScreen'>;

export const Profile_SortFavoritesScreen = ({navigation}: Props) => {
  const style = useProfileStyle();
  const {favorites, setFavoriteLocations: setFavorites} = useFavoritesContext();
  const items = favorites ?? [];
  const [sortedItems, setSortedItems] = useState(items);
  const [error, setError] = useState<string | null>(null);
  const {t} = useTranslation();
  const {theme} = useThemeContext();

  const saveOrder = async () => {
    try {
      await setFavorites(sortedItems);
      navigation.goBack();
    } catch {
      setError(t(FavoriteListTexts.sortableScreen.messages.error));
    }
  };

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(FavoriteListTexts.sortableScreen.title)}
        leftButton={{type: 'back'}}
      />

      {error && (
        <MessageInfoBox type="error" message={error} style={style.error} />
      )}

      <SortableList data={sortedItems} onSort={setSortedItems} />

      <FullScreenFooter>
        <Button
          expanded={true}
          onPress={saveOrder}
          text={t(FavoriteListTexts.sortableScreen.buttons.save)}
          rightIcon={{svg: Confirm}}
          interactiveColor={theme.color.interactive[0]}
        />
      </FullScreenFooter>
    </View>
  );
};
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.color.background.neutral[3].background,
    flex: 1,
  },
  error: {
    margin: theme.spacing.medium,
  },
  orderContainer: {
    marginTop: theme.spacing.medium,
  },
}));
