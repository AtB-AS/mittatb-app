import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text} from 'react-native';
import React from 'react';
import {StyleSheet, Theme} from '../../../theme';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import LogoOutline from '../../../assets/svg/LogoOutline';
import {useAppState} from '../../../AppContext';
import EditIcon from '../../../assets/svg/EditIcon';
import EditableListGroup from './EditableListGroup';
import MapPointIcon from '../../../assets/svg/MapPointIcon';
import {Location} from '../../../favorites/types';
import PlusIcon from '../../../assets/svg/PlusIcon';
import {ProfileStackParams} from '..';
import {StackNavigationProp} from '@react-navigation/stack';
import {useFavorites} from '../../../favorites/FavoritesContext';

type FavoriteItem = {
  location: Location;
  emoji?: string;
  name?: string;
};

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

  return (
    <SafeAreaView style={css.container}>
      <Header>Mitt AtB</Header>

      <ScrollView>
        <EditableListGroup
          title="Mine favorittsteder"
          data={items}
          renderItem={item => <Item item={item} />}
          keyExtractor={item => item.name + item.location.id}
          renderAddButtonComponent={() => (
            <AddFavoriteButton navigation={navigation} />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.primary,
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

function AddFavoriteButton({navigation}: ProfileScreenProps) {
  const css = useItemStyle();
  const onPress = () => navigation.push('AddEditFavorite');

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={css.item}>
        <PlusIcon />
        <Text style={css.text}>Legg til favorittsted</Text>
      </View>
    </TouchableOpacity>
  );
}

type ItemProps = {
  item: FavoriteItem;
  onEdit?(): void;
};
const Item: React.FC<ItemProps> = ({item, onEdit}) => {
  const css = useItemStyle();

  return (
    <View style={css.item}>
      {item.emoji ? <Text>{item.emoji}</Text> : <MapPointIcon />}
      <Text style={css.text}>{item.name ?? item.location.name}</Text>
      {onEdit && (
        <TouchableOpacity>
          <EditIcon />
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

const Header: React.FC = ({children}) => {
  const css = useHeaderStyle();
  return (
    <View style={css.container}>
      <LogoOutline />
      <View style={css.textContainer}>
        <Text style={css.text}>{children}</Text>
      </View>
    </View>
  );
};
const useHeaderStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flexDirection: 'row',
    padding: theme.sizes.pagePadding,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 20,
  },
  text: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
}));
