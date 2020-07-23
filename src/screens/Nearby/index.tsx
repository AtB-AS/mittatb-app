import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo} from 'react';
import {getDepartures} from '../../api/departures';
import {LocationButton} from '../../components/search-button';
import SearchLocationIcon from '../../components/search-location-icon';
import {Location} from '../../favorites/types';
import {useGeolocationState} from '../../GeolocationContext';
import {
  LocationWithSearchMetadata,
  useLocationSearchValue,
} from '../../location-search';
import {useReverseGeocoder} from '../../location-search/useGeocoder';
import {RootStackParamList} from '../../navigation';
import {StyleSheet} from '../../theme';
import Loading from '../Loading';
import NearbyResults from './NearbyResults';
import {TabNavigatorParams} from '../../navigation/TabNavigator';
import usePollableResource from '../../utils/use-pollable-resource';
import SearchGroup from '../../components/search-button/search-group';
import {DeparturesWithStop} from '../../sdk';
import {View, Text} from 'react-native';
import DisappearingHeader from '../../components/disappearing-header/index ';

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
    return <Loading />;
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
    fromLocation?.layer === 'venue' ? 30 : 60 ?? 0,
  );

  const openLocationSearch = () =>
    navigation.navigate('LocationSearch', {
      label: 'Fra',
      callerRouteName: NearbyRouteNameStatic,
      callerRouteParam: 'location',
      initialText: fromLocation?.name,
    });

  const renderHeader = () => (
    <SearchGroup>
      <LocationButton
        title="Fra"
        placeholder="Søk etter adresse eller sted"
        location={fromLocation}
        icon={
          <View style={{marginLeft: 2}}>
            <SearchLocationIcon location={fromLocation} />
          </View>
        }
        onPress={() => openLocationSearch()}
      />
    </SearchGroup>
  );

  return (
    <DisappearingHeader
      onRefresh={refresh}
      isRefreshing={isLoading}
      headerHeight={59}
      renderHeader={renderHeader}
      headerTitle="Avganger"
      alternativeTitleComponent={
        <Text style={styles.altTitleHeader}>{fromLocation?.name}</Text>
      }
    >
      <NearbyResults departures={departures} />
    </DisappearingHeader>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  altTitleHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}));

export default NearbyScreen;

function useNearestDepartures(
  location?: Location,
  pollingTimeInSeconds: number = 0,
): [DeparturesWithStop[] | null, () => Promise<void>, boolean, Error?] {
  const fetchDepartures = useCallback(
    async function reload() {
      if (!location) return [];
      return getDepartures(location);
    },
    [location?.id],
  );
  return usePollableResource<DeparturesWithStop[] | null>(fetchDepartures, {
    initialValue: null,
    pollingTimeInSeconds,
  });
}
