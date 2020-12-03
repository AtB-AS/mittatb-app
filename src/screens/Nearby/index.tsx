import {
  CompositeNavigationProp,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import useReducerWithSideEffects, {
  NoUpdate,
  ReducerWithSideEffects,
  SideEffect,
  Update,
  UpdateWithSideEffect,
} from 'use-reducer-with-side-effects';
import {
  DeparturesInputQuery,
  getDepartures,
  getRealtimeDeparture,
} from '../../api/departures';
import {ErrorType, getAxiosErrorType} from '../../api/utils';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import AccessibleText from '../../components/accessible-text';
import DisappearingHeader from '../../components/disappearing-header';
import ScreenReaderAnnouncement from '../../components/screen-reader-announcement';
import {LocationInput, Section} from '../../components/sections';
import ThemeIcon from '../../components/theme-icon';
import {Location, LocationWithMetadata} from '../../favorites/types';
import {useReverseGeocoder} from '../../geocoder';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '../../GeolocationContext';
import {useLocationSearchValue} from '../../location-search';
import {RootStackParamList} from '../../navigation';
import {NearbyTexts} from '../../translations';
import {useTranslation, TranslatedString} from '../../utils/language';
import {useNavigateToStartScreen} from '../../utils/navigation';
import useInterval from '../../utils/use-interval';
import Loading from '../Loading';
import NearbyResults from './NearbyResults';
import {TabNavigatorParams} from '../../navigation/TabNavigator';
import {DeparturesRealtimeData, DeparturesWithStop, Paginated} from '../../sdk';
import {
  DeparturesWithStopLocal,
  mapQuayDeparturesToShowlimits,
  showMoreItemsOnQuay,
  updateStopsWithRealtime,
} from './utils';

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

  const {t} = useTranslation();

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

  const navigateHome = useNavigateToStartScreen();
  useEffect(() => {
    if (updatingLocation)
      setLoadAnnouncement(t(NearbyTexts.stateAnnouncements.updatingLocation));
    if (isLoading && !!fromLocation) {
      setLoadAnnouncement(
        fromLocation?.resultType == 'geolocation'
          ? t(NearbyTexts.stateAnnouncements.loadingFromCurrentLocation)
          : t(
              NearbyTexts.stateAnnouncements.loadingFromGivenLocation(
                fromLocation.name,
              ),
            ),
      );
    }
  }, [updatingLocation, isLoading]);

  const renderHeader = () => (
    <Section withPadding>
      <LocationInput
        label={t(NearbyTexts.location.departurePicker.label)}
        updatingLocation={updatingLocation}
        location={fromLocation}
        onPress={openLocationSearch}
        accessibilityLabel={t(NearbyTexts.location.departurePicker.a11yLabel)}
        icon={<ThemeIcon svg={CurrentLocationArrow} />}
        onIconPress={setCurrentLocationOrRequest}
        iconAccessibility={{
          accessible: true,
          accessibilityLabel: t(NearbyTexts.location.locationButton.a11yLabel),
          accessibilityRole: 'button',
        }}
      />
    </Section>
  );

  return (
    <DisappearingHeader
      onRefresh={refresh}
      isRefreshing={isLoading}
      headerHeight={59}
      renderHeader={renderHeader}
      headerTitle={t(NearbyTexts.header.title)}
      useScroll={activateScroll}
      logoClick={{
        callback: navigateHome,
        accessibilityLabel: t(NearbyTexts.header.logo.a11yLabel),
      }}
      alternativeTitleComponent={
        <AccessibleText
          prefix={t(NearbyTexts.header.altTitle.a11yPrefix)}
          type={'paragraphHeadline'}
        >
          {fromLocation?.name}
        </AccessibleText>
      }
      onEndReached={onScrollViewEndReached}
    >
      <ScreenReaderAnnouncement message={loadAnnouncement} />
      <NearbyResults
        departures={departures}
        onShowMoreOnQuay={showMoreOnQuay}
        isFetchingMore={isFetchingMore && !isLoading}
        isInitialScreen={isInitialScreen}
        error={
          error ? t(translateErrorType(error.type, error.loadType)) : undefined
        }
      />
    </DisappearingHeader>
  );
};

function translateErrorType(
  errorType: ErrorType,
  loadType: LoadType,
): TranslatedString {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return NearbyTexts.messages.networkError;
    default:
      return NearbyTexts.messages.defaultFetchError;
  }
}

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
