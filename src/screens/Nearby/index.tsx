import {CompositeNavigationProp, RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SharedElement} from 'react-navigation-shared-element';
import {
  getNearestDepartures,
  getDeparturesFromStop,
} from '../../api/departures';
import SearchButton from '../../components/search-button';
import SearchLocationIcon from '../../components/search-location-icon';
import {Location} from '../../favorites/types';
import {useGeolocationState} from '../../GeolocationContext';
import {
  LocationWithSearchMetadata,
  useLocationSearchValue,
} from '../../location-search';
import {useReverseGeocoder} from '../../location-search/useGeocoder';
import {RootStackParamList} from '../../navigation';
import Header from '../../ScreenHeader';
import {EstimatedCall} from '../../sdk';
import {StyleSheet} from '../../theme';
import Splash from '../Splash';
import NearbyResults from './NearbyResults';
import {TabNavigatorParams} from '../../navigation/TabNavigator';
import useInterval from '../../utils/use-interval';

type NearbyRouteName = 'Nearest';
const NearbyRouteNameStatic: NearbyRouteName = 'Nearest';

export type NearbyScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<TabNavigatorParams, NearbyRouteName>,
  StackNavigationProp<RootStackParamList>
>;

type NearbyScreenProp = RouteProp<TabNavigatorParams, NearbyRouteName>;

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
    fromLocation,

    // Searching nearest is a really heavy operation,
    // so polling every 30 seconds is costly. Might
    // be a better way to do this and having subscription model for real time data.
    fromLocation?.layer === 'venue' ? 30 : 120 ?? 0,
  );

  const openLocationSearch = () =>
    navigation.navigate('LocationSearch', {
      callerRouteName: NearbyRouteNameStatic,
      callerRouteParam: 'location',
      initialText: fromLocation?.name,
    });

  return (
    <SafeAreaView style={styles.container}>
      <Header title="I nærheten" />
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

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
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
  location?: Location,
  pollingTimeInSeconds: number = 0,
): [EstimatedCall[] | null, () => Promise<void>, boolean] {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [departures, setDepartures] = useState<EstimatedCall[] | null>(null);
  const pollTime = pollingTimeInSeconds * 1000;

  const reload = useCallback(
    async function reload(
      loading: 'NO_LOADING' | 'WITH_LOADING' = 'WITH_LOADING',
    ) {
      if (!location) {
        return;
      }
      if (loading === 'WITH_LOADING') {
        setIsLoading(true);
      }
      try {
        const deps =
          location.layer === 'venue'
            ? await getDeparturesFromStop(location.id)
            : await getNearestDepartures(location.coordinates);
        setDepartures(deps);
      } finally {
        if (loading === 'WITH_LOADING') {
          setIsLoading(false);
        }
      }
    },
    [location?.id],
  );

  useEffect(() => {
    reload('WITH_LOADING');
  }, [location?.id]);

  useInterval(
    () => reload('NO_LOADING'),
    pollTime === 0 ? Number.MAX_VALUE : pollTime,
  );

  return [departures, reload, isLoading];
}
