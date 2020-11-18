import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileStackParams} from '..';
import {Add} from '../../../assets/svg/icons/actions';
import SvgReorder from '../../../assets/svg/icons/actions/Reorder';
import List from '../../../components/item-groups';
import ThemeIcon from '../../../components/theme-icon';
import {useFavorites} from '../../../favorites/FavoritesContext';
import {LocationFavorite} from '../../../favorites/types';
import MessageBox from '../../../message-box';
import {RootStackParamList} from '../../../navigation';
import {StyleSheet, Theme} from '../../../theme';
import BackHeader from '../BackHeader';

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
  const items = favorites ?? [];

  const navigateToEdit = (item: LocationFavorite) => {
    navigation.navigate('AddEditFavorite', {editItem: item});
  };
  const onAddButtonClick = () => navigation.push('AddEditFavorite', {});
  const onSortClick = () => navigation.push('SortableFavoriteList');

  return (
    <SafeAreaView style={style.container}>
      <BackHeader title="Favorittsteder" />

      <ScrollView>
        {!items?.length && (
          <MessageBox
            containerStyle={style.empty}
            message="Du har ingen favorittsteder. Du kan legg til et nå ved å trykke på knappen under."
            type="info"
          />
        )}

        <List.Group withTopMargin>
          {items.map((favorite) => (
            <List.Favorite
              key={favorite.name + favorite.location.id}
              favorite={favorite}
              onPress={() => navigateToEdit(favorite)}
            />
          ))}
        </List.Group>

        <List.Group>
          <List.Link
            text="Endre rekkefølge"
            onPress={onSortClick}
            icon={<ThemeIcon svg={SvgReorder} />}
          />
          <List.Link
            text="Legg til favorittsted"
            onPress={onAddButtonClick}
            icon={<ThemeIcon svg={Add} />}
          />
        </List.Group>
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
    paddingBottom: 0,
  },
  empty: {
    margin: theme.spacings.medium,
  },
}));
