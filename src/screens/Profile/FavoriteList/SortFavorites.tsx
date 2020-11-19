import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileStackParams} from '..';
import {Close, Confirm} from '../../../assets/svg/icons/actions';
import SvgDragHandle from '../../../assets/svg/icons/actions/DragHandle';
import Button, {ButtonGroup} from '../../../components/button';
import List from '../../../components/item-groups';
import ThemeIcon from '../../../components/theme-icon';
import {useFavorites} from '../../../favorites/FavoritesContext';
import MessageBox from '../../../message-box';
import {TabNavigatorParams} from '../../../navigation/TabNavigator';
import {StyleSheet, Theme} from '../../../theme';
import insets from '../../../utils/insets';
import BackHeader from '../BackHeader';
import {SortableList} from './SortableList';

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
  const {favorites, setFavorites} = useFavorites();
  const items = favorites ?? [];
  const [sortedItems, setSortedItems] = useState(items);
  const [error, setError] = useState<string | null>(null);

  const saveOrder = async () => {
    try {
      await setFavorites(sortedItems);
      navigation.goBack();
    } catch (_) {
      setError(
        'Ooops. Fikk ikke til å lagre favoritter. Prøv igjen er du snill. 🤞',
      );
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <BackHeader title="Endre rekkefølge" closeIcon />

      {error && (
        <MessageBox type="error" message={error} containerStyle={style.error} />
      )}

      <SortableList
        data={items}
        rowHeight={52}
        onSort={setSortedItems}
        containerStyle={style.orderContainer}
        renderRow={(data, index, state, dragHandle) => {
          let opacity = state === 'placeholder' ? 0 : 1;
          if (state === 'dragging') {
            opacity -= 0.5;
          }
          return (
            <View style={{flex: 1, opacity}}>
              <List.Group>
                <List.Favorite favorite={data} icon={dragHandle} />
              </List.Group>
            </View>
          );
        }}
        indexToKey={(i) => items[i].id}
        renderDragHandle={() => (
          <View hitSlop={insets.all(12)}>
            <ThemeIcon svg={SvgDragHandle} />
          </View>
        )}
      />

      <ButtonGroup>
        <Button
          onPress={() => navigation.goBack()}
          text="Avbryt"
          mode="secondary"
          icon={Close}
          iconPosition="right"
        />
        <Button
          onPress={saveOrder}
          text="Lagre"
          icon={Confirm}
          iconPosition="right"
        />
      </ButtonGroup>
    </SafeAreaView>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.level3,
    flex: 1,
  },
  error: {
    margin: theme.spacings.medium,
  },
  orderContainer: {
    paddingTop: theme.spacings.medium,
  },
}));
