import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileStackParams} from '..';
import {Add, Edit} from '../../../assets/svg/icons/actions';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';
import {FavoriteIcon} from '../../../favorites';
import {useFavorites} from '../../../favorites/FavoritesContext';
import {LocationFavorite} from '../../../favorites/types';
import {TabNavigatorParams} from '../../../navigation/TabNavigator';
import {StyleSheet, Theme} from '../../../theme';
import insets from '../../../utils/insets';
import BackHeader from '../BackHeader';
import EditableListGroup from './EditableListGroup';

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

export default function FavoriteList({navigation}: ProfileScreenProps) {
  const css = useProfileStyle();
  const {favorites} = useFavorites();
  const items = favorites ?? [];

  const navigateToEdit = (item: LocationFavorite) => {
    navigation.navigate('AddEditFavorite', {editItem: item});
  };
  const navigateToNearby = (item: LocationFavorite) => {
    navigation.navigate('Nearest', {
      location: {
        ...item.location,
        resultType: 'favorite',
        favoriteId: item.id,
      },
    });
  };

  const onAddButtonClick = () => navigation.push('AddEditFavorite', {});

  return (
    <SafeAreaView style={css.container}>
      <BackHeader title="Favorittsteder" />

      <ScrollView>
        <EditableListGroup
          title="Favoritter"
          data={items}
          renderItem={(item) => (
            <Item
              item={item}
              onEdit={() => navigateToEdit(item)}
              onClick={navigateToNearby}
            />
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
    color: theme.text.colors.primary,
  },
  privacyPolicy: {
    textAlign: 'center',
    marginBottom: theme.spacings.xLarge,
  },
}));

function AddFavoriteButton({onPress}: {onPress(): void}) {
  const css = useItemStyle();
  return (
    <TouchableOpacity style={css.item} onPress={onPress}>
      <ThemeIcon svg={Add} />
      <View style={css.textContainer}>
        <ThemeText style={css.text}>Legg til favorittsted</ThemeText>
      </View>
    </TouchableOpacity>
  );
}

type ItemProps = {
  item: LocationFavorite;
  onEdit?(): void;
  onClick?(item: LocationFavorite): void;
};
const Item: React.FC<ItemProps> = ({item, onEdit, onClick}) => {
  const css = useItemStyle();

  const content = item.name ? (
    <>
      <ThemeText type="paragraphHeadline" style={css.text}>
        {item.name ?? item.location.name}
      </ThemeText>
      <ThemeText style={css.text}>{item.location.label}</ThemeText>
    </>
  ) : (
    <ThemeText>{item.location.label}</ThemeText>
  );

  const clickable = onClick ? (
    <TouchableOpacity
      style={css.touchableContainer}
      onPress={() => onClick(item)}
      hitSlop={insets.all(12)}
    >
      <View style={css.innerTouchable}>
        <FavoriteIcon favorite={item} />
        <View style={css.textContainer}>{content}</View>
      </View>
    </TouchableOpacity>
  ) : (
    <View style={css.innerTouchable}>
      <FavoriteIcon favorite={item} />
      <View style={css.textContainer}>{content}</View>
    </View>
  );
  return (
    <View style={css.item}>
      {clickable}
      {onEdit && (
        <TouchableOpacity
          accessibilityLabel={'Rediger favoritt:' + item.name}
          accessibilityRole="button"
          onPress={onEdit}
          hitSlop={insets.all(12)}
        >
          <ThemeIcon svg={Edit} />
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
  touchableContainer: {
    flex: 1,
  },
  innerTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginStart: 10,
    marginEnd: 10,
  },
  text: {
    color: theme.text.colors.primary,
  },
}));
