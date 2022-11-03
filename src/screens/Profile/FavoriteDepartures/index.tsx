import * as Sections from '@atb/components/sections';
import {useFavorites} from '@atb/favorites';
import {StoredFavoriteDeparture} from '@atb/favorites/types';
import {StyleSheet, Theme} from '@atb/theme';
import {FavoriteDeparturesTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {Alert, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import {animateNextChange} from '@atb/utils/animation';
import {Add} from '@atb/assets/svg/mono-icons/actions';
import ThemeIcon from '@atb/components/theme-icon';
import {ProfileScreenProps} from '@atb/screens/Profile/types';
import {useRoute} from '@react-navigation/native';
import {DashboardScreenProps} from '@atb/screens/Dashboard/types';

type FavoriteDeparturesProfileScreenProps =
  ProfileScreenProps<'FavoriteDeparturesProfileScreen'>;
type FavoriteDeparturesDashboardScreenProps =
  DashboardScreenProps<'FavoriteDeparturesDashboardScreen'>;

type FavoriteDeparturesPropsInternal =
  | FavoriteDeparturesProfileScreenProps
  | FavoriteDeparturesDashboardScreenProps;

type NavigationProps = FavoriteDeparturesProfileScreenProps['navigation'] &
  FavoriteDeparturesDashboardScreenProps['navigation'];

// Having issues doing proper typing where the navigation
// gets all overlapping types of routes as this is used from
// several places. For routes and properties this works
// but having to _combine_ everything for navigation to work.
export type Props = FavoriteDeparturesPropsInternal & {
  navigation: NavigationProps;
};

export default function FavoriteDeparturesScreen({navigation}: Props) {
  const style = useProfileStyle();
  const {favoriteDepartures, removeFavoriteDeparture} = useFavorites();
  const {t} = useTranslation();
  const route = useRoute();
  const onDeletePress = (item: StoredFavoriteDeparture) => {
    Alert.alert(
      t(FavoriteDeparturesTexts.delete.label),
      t(FavoriteDeparturesTexts.delete.confirmWarning),
      [
        {
          text: t(FavoriteDeparturesTexts.delete.cancel),
          style: 'cancel',
        },
        {
          text: t(FavoriteDeparturesTexts.delete.delete),
          style: 'destructive',
          onPress: async () => {
            animateNextChange();
            removeFavoriteDeparture(item.id);
          },
        },
      ],
    );
  };

  const nearbyStopPlaceScreenName =
    route.name === 'FavoriteDeparturesDashboardScreen'
      ? 'NearbyStopPlacesDashboardScreen'
      : 'NearbyStopPlacesProfileScreen';
  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(FavoriteDeparturesTexts.header.title)}
        leftButton={{type: 'back'}}
      />

      <ScrollView>
        <Sections.Section withFullPadding>
          {favoriteDepartures.map((favorite) => (
            <Sections.FavoriteDepartureItem
              key={favorite.id}
              favorite={favorite}
              accessibility={{
                accessibilityHint: t(
                  FavoriteDeparturesTexts.favoriteItemDelete.a11yHint,
                ),
              }}
              onPress={onDeletePress}
            />
          ))}
        </Sections.Section>
        <Sections.Section withPadding>
          <Sections.LinkItem
            text={t(FavoriteDeparturesTexts.favoriteItemAdd.label)}
            onPress={() => {
              navigation.navigate(nearbyStopPlaceScreenName as any, {
                location: undefined,
              });
            }}
            testID="chooseLoginPhone"
            icon={<ThemeIcon svg={Add} />}
          />
        </Sections.Section>
      </ScrollView>
    </View>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.static.background.background_2.background,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  empty: {
    margin: theme.spacings.medium,
  },
}));
