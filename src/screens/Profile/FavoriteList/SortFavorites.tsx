import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {useWindowDimensions} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileStackParams} from '..';
import {Close, Confirm} from '../../../assets/svg/icons/actions';
import SvgDragHandle from '../../../assets/svg/icons/actions/DragHandle';
import Button, {ButtonGroup} from '../../../components/button';
import {FavoriteItem, Section} from '../../../components/sections';
import ThemeIcon from '../../../components/theme-icon';
import {useFavorites} from '../../../favorites/FavoritesContext';
import MessageBox from '../../../message-box';
import {TabNavigatorParams} from '../../../navigation/TabNavigator';
import {StyleSheet, Theme} from '../../../theme';
import useIsScreenReaderEnabled from '../../../utils/use-is-screen-reader-enabled';
import BackHeader from '../BackHeader';
import {SortableList} from './SortableList';
import SortableListFallback from './SortableListFallback';

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
  const screenReaderEnabled = useIsScreenReaderEnabled();
  const {fontScale} = useWindowDimensions();
  const minHeight = 40 + 12 * fontScale;

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

      {screenReaderEnabled ? (
        <SortableListFallback data={sortedItems} onSort={setSortedItems} />
      ) : (
        <SortableList
          data={items}
          // @TODO Find solution for not hardcoding this.
          rowHeight={minHeight}
          onSort={setSortedItems}
          containerStyle={style.orderContainer}
          renderRow={(data, index, state, onGestureEvent) => {
            let opacity = state === 'placeholder' ? 0 : 1;
            if (state === 'dragging') {
              opacity -= 0.5;
            }
            return (
              <PanGestureHandler
                maxPointers={1}
                onGestureEvent={onGestureEvent}
                onHandlerStateChange={onGestureEvent}
              >
                <Animated.View style={{flex: 1, opacity}}>
                  <Section withPadding>
                    <FavoriteItem
                      favorite={data}
                      icon={<ThemeIcon svg={SvgDragHandle} />}
                    />
                  </Section>
                </Animated.View>
              </PanGestureHandler>
            );
          }}
          indexToKey={(i) => items[i].id}
        />
      )}

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
    marginTop: theme.spacings.medium,
  },
}));
