import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text} from 'react-native';
import React from 'react';
import {StyleSheet, Theme} from '../../../theme';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import {Add, Adjust} from '../../../assets/svg/icons/actions';
import EditableListGroup from './EditableListGroup';
import {LocationFavorite} from '../../../favorites/types';
import {ProfileStackParams} from '..';
import {StackNavigationProp} from '@react-navigation/stack';
import {useFavorites} from '../../../favorites/FavoritesContext';
import Header from '../../../ScreenHeader';
import {FavoriteIcon} from '../../../favorites';
import insets from '../../../utils/insets';
import useChatIcon from '../../../utils/use-chat-icon';

export type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'Profile'
>;

type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
};

export default function Profile({navigation}: ProfileScreenProps) {
  const css = useProfileStyle();
  const {favorites} = useFavorites();
  const items = favorites ?? [];

  const navigateToEdit = (item: LocationFavorite) => {
    navigation.navigate('AddEditFavorite', {editItem: item});
  };

  const onAddButtonClick = () => navigation.push('AddEditFavorite', {});

  const {icon: chatIcon, openChat} = useChatIcon();

  return (
    <SafeAreaView style={css.container}>
      <Header
        title="Mitt AtB"
        rightButton={{icon: chatIcon, onPress: openChat}}
      />

      <ScrollView>
        <EditableListGroup
          title="Mine favorittsteder"
          data={items}
          renderItem={(item) => (
            <Item item={item} onEdit={() => navigateToEdit(item)} />
          )}
          keyExtractor={(item) => item.name + item.location.id}
          renderAddButtonComponent={() => (
            <AddFavoriteButton onPress={onAddButtonClick} />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.level1,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingBottom: 0,
  },
  text: {
    color: theme.text.primary,
  },
}));

function AddFavoriteButton({onPress}: {onPress(): void}) {
  const css = useItemStyle();
  return (
    <TouchableOpacity style={css.item} onPress={onPress}>
      <Add />
      <Text style={css.text}>Legg til favorittsted</Text>
    </TouchableOpacity>
  );
}

type ItemProps = {
  item: LocationFavorite;
  onEdit?(): void;
};
const Item: React.FC<ItemProps> = ({item, onEdit}) => {
  const css = useItemStyle();

  return (
    <View style={css.item}>
      <FavoriteIcon favorite={item} />
      <Text style={css.text}>{item.name ?? item.location.name}</Text>
      {onEdit && (
        <TouchableOpacity onPress={onEdit} hitSlop={insets.all(12)}>
          <Adjust />
        </TouchableOpacity>
      )}
    </View>
  );
};
const useItemStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  item: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  text: {
    flex: 1,
    marginStart: 10,
    marginEnd: 10,
    fontSize: 16,
    fontWeight: '600',
  },
}));
