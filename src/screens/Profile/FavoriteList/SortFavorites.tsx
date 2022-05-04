import {Confirm} from '@atb/assets/svg/mono-icons/actions';
import Button from '@atb/components/button';
import {useFavorites} from '@atb/favorites';
import MessageBox from '@atb/components/message-box';
import {TabNavigatorParams} from '@atb/navigation/TabNavigator';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteListTexts, useTranslation} from '@atb/translations';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {ProfileStackParams} from '..';
import SortableList from './SortableList';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {View} from 'react-native';
import FullScreenFooter from '@atb/components/screen-footer/full-footer';

export type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'ProfileHome'
>;

type ProfileNearbyScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TabNavigatorParams, 'Profile'>,
  ProfileScreenNavigationProp
>;

type ProfileScreenProps = {
  navigation: ProfileNearbyScreenNavigationProp;
};

export default function SortableFavoriteList({navigation}: ProfileScreenProps) {
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

      {error && (
        <MessageBox type="error" message={error} containerStyle={style.error} />
      )}

      <SortableList data={sortedItems} onSort={setSortedItems} />

      <FullScreenFooter>
        <Button
          onPress={saveOrder}
          text={t(FavoriteListTexts.sortableScreen.buttons.save)}
          icon={Confirm}
          iconPosition="right"
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
