import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import Button from '@atb/components/button';
import {MessageBox} from '@atb/components/message-box';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {useFavorites} from '@atb/favorites';
import {RootStackScreenProps} from '@atb/navigation/types';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteListTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {View} from 'react-native';
import {ProfileScreenProps} from '../types';
import SortableList from './SortableList';

type RootProps =
  | ProfileScreenProps<'FavoriteList'>
  | RootStackScreenProps<'SortableFavoriteList'>;

export default function SortableFavoriteList({navigation}: RootProps) {
  const style = useProfileStyle();
  const {favorites, setFavoriteLocationss: setFavorites} = useFavorites();
  const items = favorites ?? [];
  const [sortedItems, setSortedItems] = useState(items);
  const [error, setError] = useState<string | null>(null);
  const {t} = useTranslation();

  const saveOrder = async () => {
    try {
      await setFavorites(sortedItems);
      navigation.goBack();
    } catch (_) {
      setError(t(FavoriteListTexts.sortableScreen.messages.error));
    }
  };

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(FavoriteListTexts.sortableScreen.title)}
        leftButton={{type: 'cancel'}}
      />

      {error && <MessageBox type="error" message={error} style={style.error} />}

      <SortableList data={sortedItems} onSort={setSortedItems} />

      <FullScreenFooter>
        <Button
          onPress={saveOrder}
          text={t(FavoriteListTexts.sortableScreen.buttons.save)}
          rightIcon={Confirm}
          interactiveColor="interactive_0"
        />
      </FullScreenFooter>
    </View>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_3.background,
    flex: 1,
  },
  error: {
    margin: theme.spacings.medium,
  },
  orderContainer: {
    marginTop: theme.spacings.medium,
  },
}));
