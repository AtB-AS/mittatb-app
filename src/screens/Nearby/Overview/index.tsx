import React, {useMemo} from 'react';
import {StackNavigationProp} from '@react-navigation/stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useGeolocationState} from '../../../GeolocationContext';
import Splash from '../../Splash';
import {StyleSheet} from '../../../theme';
import {Location} from '../../../favorites/types';
import {
  useLocationSearchValue,
  LocationWithSearchMetadata,
} from '../../../location-search';
import {RouteProp, CompositeNavigationProp} from '@react-navigation/core';
import SearchButton from './SearchButton';
import {RootStackParamList} from '../../../navigation';
import {SharedElement} from 'react-navigation-shared-element';
import Header from '../../../ScreenHeader';
import {useReverseGeocoder} from '../../../location-search/useGeocoder';
import {NearbyStackParams} from '..';

type NearbyRouteName = 'Nearby';
const NearbyRouteNameStatic: NearbyRouteName = 'Nearby';

export type NearbyScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<NearbyStackParams, NearbyRouteName>,
  StackNavigationProp<RootStackParamList>
>;

type NearbyScreenProp = RouteProp<NearbyStackParams, NearbyRouteName>;

type RootProps = {
  navigation: NearbyScreenNavigationProp;
  route: NearbyScreenProp;
};

const NearbyScreen: React.FC<RootProps> = ({navigation}) => {
  const {status, location} = useGeolocationState();

  const reverseLookupLocations = useReverseGeocoder(location) ?? [];
  const currentLocation = reverseLookupLocations.length
    ? reverseLookupLocations[1]
    : undefined;

  if (!status) {
    return <Splash />;
  }

  return (
    <NearbyOverview currentLocation={currentLocation} navigation={navigation} />
  );
};

type Props = {
  currentLocation?: Location;
  navigation: NearbyScreenNavigationProp;
};

const NearbyOverview: React.FC<Props> = ({currentLocation, navigation}) => {
  const styles = useThemeStyles();
  // const {favorites} = useFavorites();

  const searchedFromLocation = useLocationSearchValue<NearbyScreenProp>(
    'location',
  );

  const currentSearchLocation = useMemo<LocationWithSearchMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [currentLocation],
  );

  const fromLocation = searchedFromLocation ?? currentSearchLocation;

  const openLocationSearch = () =>
    navigation.navigate('LocationSearch', {
      callerRouteName: NearbyRouteNameStatic,
      callerRouteParam: 'location',
    });

  return (
    <SafeAreaView style={styles.container}>
      <Header>I nærheten</Header>
      <SharedElement id="locationSearchInput">
        <SearchButton
          title="Fra"
          placeholder="Søk etter adresse eller sted"
          location={fromLocation}
          // icon={fromIcon}
          onPress={() => openLocationSearch()}
        />
      </SharedElement>
    </SafeAreaView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  container: {
    backgroundColor: theme.background.primary,
    flex: 1,
  },
}));

export default NearbyScreen;
