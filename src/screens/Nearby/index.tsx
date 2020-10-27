import {
  CompositeNavigationProp,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useMemo, useEffect, useState} from 'react';
import {
  getDepartures,
  getRealtimeDeparture,
  DeparturesInputQuery,
} from '../../api/departures';
import {LocationButton} from '../../components/search-button';
import {Location, LocationWithMetadata} from '../../favorites/types';
import {
  useGeolocationState,
  RequestPermissionFn,
} from '../../GeolocationContext';
import {RootStackParamList} from '../../navigation';
import {StyleSheet} from '../../theme';
import Loading from '../Loading';
import NearbyResults from './NearbyResults';
import {TabNavigatorParams} from '../../navigation/TabNavigator';
import SearchGroup from '../../components/search-button/search-group';
import DisappearingHeader from '../../components/disappearing-header';
import {DeparturesWithStop, Paginated, DeparturesRealtimeData} from '../../sdk';
import {View, TouchableOpacity, ActivityIndicator} from 'react-native';
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
import AccessibleText from '../../components/accessible-text';
import {useReverseGeocoder} from '../../geocoder';
import {useLocationSearchValue} from '../../location-search';
import {useNavigateHome} from '../../utils/navigation';
import {ErrorType, getAxiosErrorType} from '../../api/utils';
import colors from '../../theme/colors';
import ThemeIcon from '../../components/theme-icon';
import ScreenreaderAnnouncement from '../../components/screen-reader-announcement';

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
  const {
    status,
    location,
    locationEnabled,
    requestPermission,
  } = useGeolocationState();

  const {locations: reverseLookupLocations} =
    useReverseGeocoder(location?.coords ?? null) ?? [];
  const currentLocation = reverseLookupLocations?.length
    ? reverseLookupLocations[1]
    : undefined;

  if (!status) {
    return <Loading />;
  }

  return (
    <NearbyOverview
      requestGeoPermission={requestPermission}
      hasLocationPermission={locationEnabled && status === 'granted'}
      currentLocation={currentLocation}
      navigation={navigation}
    />
  );
};

type Props = {
  currentLocation?: Location;
  hasLocationPermission: boolean;
  requestGeoPermission: RequestPermissionFn;
  navigation: NearbyScreenNavigationProp;
};

const NearbyOverview: React.FC<Props> = ({
  requestGeoPermission,
  currentLocation,
  hasLocationPermission,
  navigation,
}) => {
  const styles = useThemeStyles();
  const searchedFromLocation = useLocationSearchValue<NearbyScreenProp>(
    'location',
  );
  const [loadAnnouncement, setLoadAnnouncement] = useState<string>('');

  const currentSearchLocation = useMemo<LocationWithMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [currentLocation],
  );
  const fromLocation = searchedFromLocation ?? currentSearchLocation;

  const updatingLocation = !fromLocation && hasLocationPermission;

  const {state, refresh, loadMore, showMoreOnQuay} = useDepartureData(
    fromLocation,
  );

  const {departures, isLoading, isFetchingMore, error} = state;

  const isInitialScreen = departures == null && !isLoading && !error;
  const activateScroll = !isInitialScreen || !!error;

  const onScrollViewEndReached = () => departures?.length && loadMore();

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

  const navigateHome = useNavigateHome();
  useEffect(() => {
    if (updatingLocation)
      setLoadAnnouncement(
        'Oppdaterer posisjon for å finne avganger i nærheten.',
      );
    if (isLoading && !!fromLocation) {
      setLoadAnnouncement(
        'Laster avganger i nærheten av ' +
          (fromLocation?.resultType == 'geolocation'
            ? 'gjeldende posisjon'
            : fromLocation?.label),
      );
    }
  }, [updatingLocation, isLoading]);

  const renderHeader = () => (
    <SearchGroup>
      <View style={styles.searchButtonContainer}>
        <View style={styles.styleButton}>
          <LocationButton
            title="Fra"
            placeholder={
              updatingLocation
                ? 'Oppdaterer posisjon'
                : 'Søk etter adresse eller sted'
            }
            icon={
              updatingLocation ? (
                <ActivityIndicator color={colors.general.gray200} />
              ) : undefined
            }
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
          <ThemeIcon svg={CurrentLocationArrow} />
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
      logoClick={{
        callback: navigateHome,
        accessibilityLabel: 'Gå til startskjerm',
      }}
      alternativeTitleComponent={
        <AccessibleText prefix="Avganger fra" style={styles.altTitleHeader}>
          {fromLocation?.name}
        </AccessibleText>
      }
      onEndReached={onScrollViewEndReached}
    >
      <ScreenreaderAnnouncement message={loadAnnouncement} />
      <NearbyResults
        departures={departures}
        onShowMoreOnQuay={showMoreOnQuay}
        isFetchingMore={isFetchingMore && !isLoading}
        isInitialScreen={isInitialScreen}
        error={
          error ? translateErrorType(error.type, error.loadType) : undefined
        }
      />
    </DisappearingHeader>
  );
};

function translateErrorType(errorType: ErrorType, loadType: LoadType): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return 'Hei, er du på nett? Vi kan ikke oppdatere avgangene siden nettforbindelsen din mangler eller er ustabil.';
    default:
      return 'Oops - vi klarte ikke hente avganger. Supert om du prøver igjen 🤞';
  }
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  altTitleHeader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  styleButton: {
    flexGrow: 1,
  },
}));

export default NearbyScreen;

type LoadType = 'initial' | 'more';

type DepartureDataState = {
  departures: DeparturesWithStopLocal[] | null;
  error?: {type: ErrorType; loadType: LoadType};
  locationId?: string;
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
  error: undefined,
  locationId: undefined,
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
      locationId?: string;
      reset?: boolean;
      paginationData: Paginated<DeparturesWithStop[]>;
    }
  | {
      type: 'SET_ERROR';
      loadType: LoadType;
      error: ErrorType;
      reset?: boolean;
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
        {
          ...state,
          isLoading: true,
          error: undefined,
          isFetchingMore: true,
          queryInput,
        },
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
              locationId: action.location?.id,
              paginationData,
            });
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              reset: action.location?.id !== state.locationId,
              loadType: 'initial',
              error: getAxiosErrorType(e),
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
        {...state, error: undefined, isFetchingMore: true},
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
              locationId: action.location?.id,
              paginationData,
            });
          } catch (e) {
            dispatch({
              type: 'SET_ERROR',
              loadType: 'more',
              error: getAxiosErrorType(e),
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
          try {
            const realtimeData = await getRealtimeDeparture(
              state.departures ?? [],
              state.queryInput,
            );
            dispatch({
              type: 'UPDATE_REALTIME',
              realtimeData,
            });
          } catch (e) {
            console.warn(e);
          }
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
        locationId: action.locationId,
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

    case 'SET_ERROR': {
      return Update({
        ...state,
        error: {
          type: action.error,
          loadType: action.loadType,
        },
        departures: action.reset ? null : state.departures,
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
