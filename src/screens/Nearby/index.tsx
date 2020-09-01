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
  DeparturesInputQuery,
} from '../../api/departures';
import {LocationButton} from '../../components/search-button';
import {Location} from '../../favorites/types';
import {
  useGeolocationState,
  RequestPermissionFn,
} from '../../GeolocationContext';
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
import {View, Text, TouchableOpacity} from 'react-native';
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
import insets from '../../utils/insets';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import TextHiddenSupportPrefix from '../../components/text-hidden-support-prefix';

const DEFAULT_NUMBER_OF_DEPARTURES_TO_SHOW = 5;

// Should be a multiplum of the number we are showing.
const DEFAULT_NUMBER_OF_DEPARTURES_TO_FETCH = 15;

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
  const {status, location, requestPermission} = useGeolocationState();

  const reverseLookupLocations =
    useReverseGeocoder(location?.coords ?? null) ?? [];
  const currentLocation = reverseLookupLocations.length
    ? reverseLookupLocations[1]
    : undefined;

  if (!status) {
    return <Loading />;
  }

  return (
    <NearbyOverview
      requestGeoPermission={requestPermission}
      currentLocation={currentLocation}
      navigation={navigation}
    />
  );
};

type Props = {
  currentLocation?: Location;
  requestGeoPermission: RequestPermissionFn;
  navigation: NearbyScreenNavigationProp;
};

const NearbyOverview: React.FC<Props> = ({
  requestGeoPermission,
  currentLocation,
  navigation,
}) => {
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
  const {departures, isLoading, isFetchingMore} = state;

  const isInitialScreen = departures == null && !isLoading;
  const activateScroll = !isInitialScreen;

  const openLocationSearch = () =>
    navigation.navigate('LocationSearch', {
      label: 'Fra',
      callerRouteName: NearbyRouteNameStatic,
      callerRouteParam: 'location',
      initialLocation: fromLocation,
    });

  function setCurrentLocationAsFrom() {
    navigation.setParams({
      location: currentLocation && {
        ...currentLocation,
        resultType: 'geolocation',
      },
    });
  }

  async function setCurrentLocationOrRequest() {
    if (currentLocation) {
      setCurrentLocationAsFrom();
    } else {
      const status = await requestGeoPermission();
      if (status === 'granted') {
        setCurrentLocationAsFrom();
      }
    }
  }

  const renderHeader = () => (
    <SearchGroup>
      <View style={styles.searchButtonContainer}>
        <View style={styles.styleButton}>
          <LocationButton
            title="Fra"
            placeholder="Søk etter adresse eller sted"
            location={fromLocation}
            onPress={openLocationSearch}
            accessible={true}
            accessibilityLabel="Søk på avreisested."
            accessibilityRole="button"
          />
        </View>

        <TouchableOpacity
          hitSlop={insets.all(12)}
          accessible={true}
          accessibilityLabel="Bruk min posisjon."
          accessibilityRole="button"
          onPress={setCurrentLocationOrRequest}
        >
          <CurrentLocationArrow />
        </TouchableOpacity>
      </View>
    </SearchGroup>
  );

  return (
    <DisappearingHeader
      onRefresh={refresh}
      isRefreshing={isLoading}
      headerHeight={59}
      renderHeader={renderHeader}
      headerTitle="Avganger"
      useScroll={activateScroll}
      alternativeTitleComponent={
        <TextHiddenSupportPrefix
          prefix="Avganger fra"
          style={styles.altTitleHeader}
        >
          {fromLocation?.name}
        </TextHiddenSupportPrefix>
      }
      onEndReached={loadMore}
    >
      <NearbyResults
        departures={departures}
        onShowMoreOnQuay={showMoreOnQuay}
        isFetchingMore={isFetchingMore && !isLoading}
        isInitialScreen={isInitialScreen}
      />
    </DisappearingHeader>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  altTitleHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  styleButton: {
    flexGrow: 1,
  },
}));

export default NearbyScreen;

type DepartureDataState = {
  departures: DeparturesWithStopLocal[] | null;
  isLoading: boolean;
  isFetchingMore: boolean;
  queryInput: DeparturesInputQuery;
  paging: Partial<Paginated<DeparturesWithStop[]>>;
};

const initialQueryInput: DeparturesInputQuery = {
  numberOfDepartures: DEFAULT_NUMBER_OF_DEPARTURES_TO_FETCH,
  startTime: new Date(),
};
const initialPaging = {
  pageOffset: 0,
  pageSize: 2,
  hasNext: true,
};
const initialState: DepartureDataState = {
  departures: null,
  isLoading: false,
  isFetchingMore: false,
  paging: initialPaging,
  queryInput: initialQueryInput,
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
      type: 'STOP_LOADER';
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
      if (!action.location) return NoUpdate();

      // Update input data with new date as this
      // is a fresh fetch. We should fetch tha latest information.
      const queryInput: DeparturesInputQuery = {
        ...state.queryInput,
        startTime: new Date(),
      };

      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {...state, isLoading: true, isFetchingMore: true, queryInput},
        async (_, dispatch) => {
          try {
            // Fresh fetch, reset paging and use new query input with new startTime
            const paginationData = await getDepartures(action.location!, {
              ...initialPaging,
              ...queryInput,
            });

            dispatch({
              type: 'UPDATE_DEPARTURES',
              reset: true,
              paginationData,
            });
          } finally {
            dispatch({type: 'STOP_LOADER'});
          }
        },
      );
    }

    case 'LOAD_MORE_DEPARTURES': {
      if (!action.location || !state.paging.hasNext) return NoUpdate();
      if (state.isFetchingMore) return NoUpdate();

      return UpdateWithSideEffect<DepartureDataState, DepartureDataActions>(
        {...state, isFetchingMore: true},
        async (state, dispatch) => {
          try {
            // Use previously stored queryInput with stored startTime
            // to ensure that we get the same departures.
            const paginationData = await getDepartures(action.location!, {
              ...state.paging,
              ...state.queryInput,
            });

            dispatch({
              type: 'UPDATE_DEPARTURES',
              paginationData,
            });
          } finally {
            dispatch({type: 'STOP_LOADER'});
          }
        },
      );
    }

    case 'LOAD_REALTIME_DATA': {
      if (!state.departures?.length) return NoUpdate();

      return SideEffect<DepartureDataState, DepartureDataActions>(
        async (state, dispatch) => {
          // Use same query input with same startTime to ensure that
          // we get the same result.
          const realtimeData = await getRealtimeDeparture(
            state.departures ?? [],
            state.queryInput,
          );
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
          state.departures ?? [],
          action.quayId,
          DEFAULT_NUMBER_OF_DEPARTURES_TO_SHOW,
        ),
      });
    }

    case 'STOP_LOADER': {
      return Update({
        ...state,
        isLoading: false,
        isFetchingMore: false,
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
          : (state.departures ?? []).concat(
              mapQuayDeparturesToShowlimits(
                action.paginationData.data,
                DEFAULT_NUMBER_OF_DEPARTURES_TO_SHOW,
              ),
            ),

        // Update paging with new offset to fetch new page later.
        paging: {
          ...state.paging,
          hasNext: action.paginationData.hasNext,
          totalResults: action.paginationData.totalResults,
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
          state.departures ?? [],
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
