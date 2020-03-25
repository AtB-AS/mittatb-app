import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SharedElement} from 'react-navigation-shared-element';
import {NearbyStackParams} from '..';
import {getNearestDepartures} from '../../../api/departures';
import SearchButton from '../../../components/search-button';
import SearchLocationIcon from '../../../components/search-location-icon';
import {Location} from '../../../favorites/types';
import {useGeolocationState} from '../../../GeolocationContext';
import {
  LocationWithSearchMetadata,
  useLocationSearchValue,
} from '../../../location-search';
import {useReverseGeocoder} from '../../../location-search/useGeocoder';
import {RootStackParamList} from '../../../navigation';
import Header from '../../../ScreenHeader';
import {Coordinates, EstimatedCall} from '../../../sdk';
import {StyleSheet} from '../../../theme';
import Splash from '../../Splash';
import NearbyResults from './NearbyResults';

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
  const searchedFromLocation = useLocationSearchValue<NearbyScreenProp>(
    'location',
  );

  const currentSearchLocation = useMemo<LocationWithSearchMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [currentLocation],
  );
  const fromLocation = searchedFromLocation ?? currentSearchLocation;
  const [departures, refresh, isLoading] = useNearestDepartures(
    fromLocation?.coordinates,
  );

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
          icon={<SearchLocationIcon location={fromLocation} />}
          onPress={() => openLocationSearch()}
        />
      </SharedElement>

      <NearbyResults
        departures={departures}
        onRefresh={refresh}
        isRefreshing={isLoading}
      />
    </SafeAreaView>
  );
};

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  container: {
    backgroundColor: theme.background.primary,
    paddingBottom: 0,
    flex: 1,
  },
  spinner: {
    height: 100,
  },
  sectionHeader: {
    marginLeft: theme.sizes.pagePadding,
    marginRight: theme.sizes.pagePadding,
    marginTop: 12,
  },
}));

export default NearbyScreen;

function useNearestDepartures(
  location?: Coordinates,
): [EstimatedCall[], () => Promise<void>, boolean] {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [departures, setDepartures] = useState<EstimatedCall[]>([]);

  const dep = [JSON.stringify(location)];

  const reload = useCallback(async function reload() {
    if (!location) {
      return;
    }
    setIsLoading(true);

    try {
      const deps = await getNearestDepartures(location);
      setDepartures(deps);
    } finally {
      setIsLoading(false);
    }
  }, dep);

  useEffect(() => {
    reload();
  }, dep);

  return [departures, reload, isLoading];
}
