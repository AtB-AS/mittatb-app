import {Confirm} from '@atb/assets/svg/icons/actions';
import SvgDragHandle from '@atb/assets/svg/icons/actions/DragHandle';
import Button from '@atb/components/button';
import {FavoriteItem, Section} from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import {useFavorites} from '@atb/favorites';
import MessageBox from '@atb/components/message-box';
import {TabNavigatorParams} from '@atb/navigation/TabNavigator';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteListTexts, useTranslation} from '@atb/translations';
import useIsScreenReaderEnabled from '@atb/utils/use-is-screen-reader-enabled';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState} from 'react';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {ProfileStackParams} from '..';
import {SortableList} from './SortableList';
import SortableListFallback from './SortableListFallback';
import useFontScale from '@atb/utils/use-font-scale';
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
  const screenReaderEnabled = useIsScreenReaderEnabled();
  const fontScale = useFontScale();
  const minHeight = 40 + 12 * fontScale;
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

      <FullScreenFooter>
        <Button
          onPress={saveOrder}
          text={t(FavoriteListTexts.sortableScreen.buttons.save)}
          icon={Confirm}
          iconPosition="right"
          color="primary_2"
        />
      </FullScreenFooter>
    </View>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.colors.background_3.backgroundColor,
    flex: 1,
  },
  error: {
    margin: theme.spacings.medium,
  },
  orderContainer: {
    marginTop: theme.spacings.medium,
  },
}));
