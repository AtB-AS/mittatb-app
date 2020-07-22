import {
  CompositeNavigationProp,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo, useEffect} from 'react';
import {
  getDepartures,
  getRealtimeDeparture,
  DepartureQuery,
} from '../../api/departures';
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
import SearchGroup from '../../components/search-button/search-group';
import DisappearingHeader from '../../components/disappearing-header/index ';
import {DeparturesWithStop, Paginated, DeparturesRealtimeData} from '../../sdk';
import {View, Text} from 'react-native';
import useReducerWithSideEffects, {
  Update,
  ReducerWithSideEffects,
  SideEffect,
  NoUpdate,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import useInterval from '../../utils/use-interval';
import {
  updateStopsWithRealtime,
  DeparturesWithStopLocal,
  mapQuayDeparturesToShowlimits,
  showMoreItemsOnQuay,
} from './utils';

const DEFAULT_NUMBER_OF_DEPARTURES_TO_SHOW = 5;

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

  const {state, refresh, loadMore, showMoreOnQuay} = useDepartureData(
    fromLocation,
  );
  const {departures, isLoading} = state;

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
      <NearbyResults
        departures={departures}
        onShowMoreOnQuay={showMoreOnQuay}
      />
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

type DepartureDataState = {
  departures: DeparturesWithStopLocal[];
  isLoading: boolean;
  paging: DepartureQuery & {
    hasNext: boolean;
  };
};

const initialPaging = {
  limit: 15,
  pageOffset: 0,
  pageSize: 2,
  hasNext: true,
};
const initialState: DepartureDataState = {
  departures: [],
  isLoading: false,
  paging: initialPaging,
};

type DepartureDataActions =
  | {
      type: 'SHOW_MORE_ON_QUAY';
      quayId: string;
    }
  | {
      type: 'LOAD_INITIAL_DEPARTURES';
      location: Location | undefined;
    }
  | {
      type: 'LOAD_MORE_DEPARTURES';
      location: Location | undefined;
    }
  | {
      type: 'LOAD_REALTIME_DATA';
    }
  | {
      type: 'UPDATE_DEPARTURES';
      reset?: boolean;
      paginationData: Paginated<DeparturesWithStop[]>;
    }
  | {
      type: 'UPDATE_REALTIME';
      realtimeData: DeparturesRealtimeData;
    };

const reducer: ReducerWithSideEffects<
  DepartureDataState,
  DepartureDataActions
> = (state, action) => {
  switch (action.type) {
    case 'LOAD_INITIAL_DEPARTURES': {
      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {...state, isLoading: true},
        async (_, dispatch) => {
          if (!action.location) return;
          const paginationData = await getDepartures(
            action.location,
            initialPaging,
          );

          dispatch({
            type: 'UPDATE_DEPARTURES',
            reset: true,
            paginationData,
          });
        },
      );
    }

    case 'LOAD_MORE_DEPARTURES': {
      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {...state, isLoading: true},
        async (state, dispatch) => {
          if (!action.location) return;
          if (!state.paging.hasNext) return;

          const paginationData = await getDepartures(
            action.location,
            state.paging,
          );

          dispatch({
            type: 'UPDATE_DEPARTURES',
            paginationData,
          });
        },
      );
    }

    case 'LOAD_REALTIME_DATA': {
      return SideEffect<DepartureDataState, DepartureDataActions>(
        async (state, dispatch) => {
          const realtimeData = await getRealtimeDeparture(state.departures);
          dispatch({
            type: 'UPDATE_REALTIME',
            realtimeData,
          });
        },
      );
    }

    case 'SHOW_MORE_ON_QUAY': {
      return Update({
        ...state,
        departures: showMoreItemsOnQuay(
          state.departures,
          action.quayId,
          DEFAULT_NUMBER_OF_DEPARTURES_TO_SHOW,
        ),
      });
    }

    case 'UPDATE_DEPARTURES': {
      return Update({
        ...state,
        isLoading: false,
        departures: action.reset
          ? mapQuayDeparturesToShowlimits(
              action.paginationData.data,
              DEFAULT_NUMBER_OF_DEPARTURES_TO_SHOW,
            )
          : state.departures.concat(
              mapQuayDeparturesToShowlimits(
                action.paginationData.data,
                DEFAULT_NUMBER_OF_DEPARTURES_TO_SHOW,
              ),
            ),
        paging: {
          ...state.paging,
          hasNext: action.paginationData.hasNext,
          pageOffset: action.paginationData.hasNext
            ? action.paginationData.nextPageOffset
            : state.paging.pageOffset,
        },
      });
    }

    case 'UPDATE_REALTIME': {
      return Update({
        ...state,
        departures: updateStopsWithRealtime(
          state.departures,
          action.realtimeData,
        ),
      });
    }

    default:
      return NoUpdate();
  }
};

function useDepartureData(
  location?: Location,
  updateFrequencyInSeconds: number = 30,
) {
  const [state, dispatch] = useReducerWithSideEffects(reducer, initialState);
  const isFocused = useIsFocused();

  const refresh = useCallback(
    () => dispatch({type: 'LOAD_INITIAL_DEPARTURES', location}),
    [location?.id],
  );

  const loadMore = useCallback(
    () => dispatch({type: 'LOAD_MORE_DEPARTURES', location}),
    [location?.id],
  );

  const showMoreOnQuay = useCallback(
    (quayId: string) => dispatch({type: 'SHOW_MORE_ON_QUAY', quayId}),
    [],
  );

  useEffect(refresh, [location?.id]);
  useInterval(
    () => dispatch({type: 'LOAD_REALTIME_DATA'}),
    updateFrequencyInSeconds * 1000,
    [location?.id],
    !isFocused,
  );

  return {
    state,
    refresh,
    loadMore,
    showMoreOnQuay,
  };
}
