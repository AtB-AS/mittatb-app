import {ErrorType} from '@atb/api/utils';
import {CurrentLocationArrow} from '@atb/assets/svg/icons/places';
import AccessibleText from '@atb/components/accessible-text';
import {useBottomSheet} from '@atb/components/bottom-sheet';
import SimpleDisappearingHeader from '@atb/components/disappearing-header/simple';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {ActionItem, LocationInput, Section} from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import DeparturesList from '@atb/departure-list/DeparturesList';
import FavoriteChips from '@atb/favorite-chips';
import {Location, LocationWithMetadata} from '@atb/favorites/types';
import {useReverseGeocoder} from '@atb/geocoder';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '@atb/GeolocationContext';
import {useOnlySingleLocation} from '@atb/location-search';
import {RootStackParamList} from '@atb/navigation';
import {usePreferences} from '@atb/preferences';
import {StyleSheet} from '@atb/theme';
import {ThemeColor} from '@atb/theme/colors';
import {
  Language,
  NearbyTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import {formatToShortDateTimeWithoutYear} from '@atb/utils/date';
import {TFunc} from '@leile/lobo-t';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {NearbyStackParams} from '../Nearby';
import Loading from '../Loading';
import DepartureTimeSheet from '../Nearby/DepartureTimeSheet';
import {useDepartureData} from '../Nearby/state';
import {useNearestStopsData} from './state';
import ThemeText from '@atb/components/text';
import {Coordinates, StopPlaceDetails, TransportMode} from '@atb/sdk';
import * as Sections from '@atb/components/sections';
import {
  locationDistanceInMetres,
  primitiveLocationDistanceInMetres,
} from '@atb/utils/location';
import haversine from 'haversine-distance';
import {BusSide} from '@atb/assets/svg/icons/transportation';
import TransportationIcon, {
  getTransportModeSvg,
} from '@atb/components/transportation-icon';

const themeColor: ThemeColor = 'background_gray';

const DateOptions = ['now', 'departure'] as const;
type DateOptionType = typeof DateOptions[number];
export type SearchTime = {
  option: DateOptionType;
  date: string;
};

type NearbyRouteName = 'NearbyRoot';
const NearbyRouteNameStatic: NearbyRouteName = 'NearbyRoot';

export type NearbyScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<NearbyStackParams>,
  StackNavigationProp<RootStackParamList>
>;

export type NearbyScreenParams = {
  location: LocationWithMetadata;
};

export type NearbyScreenProp = RouteProp<NearbyStackParams, NearbyRouteName>;

type RootProps = {
  navigation: NearbyScreenNavigationProp;
  route: NearbyScreenProp;
};

export default function NearbyScreen({navigation}: RootProps) {
  const {
    status,
    location,
    locationEnabled,
    requestPermission,
  } = useGeolocationState();

  const {closestLocation: currentLocation} = useReverseGeocoder(
    location?.coords ?? null,
  );

  if (!status) {
    return <Loading />;
  }

  return (
    <DeparturesOverview
      requestGeoPermission={requestPermission}
      hasLocationPermission={locationEnabled && status === 'granted'}
      currentLocation={currentLocation}
      navigation={navigation}
    />
  );
}

type Props = {
  currentLocation?: Location;
  hasLocationPermission: boolean;
  requestGeoPermission: RequestPermissionFn;
  navigation: NearbyScreenNavigationProp;
};

const DeparturesOverview: React.FC<Props> = ({
  requestGeoPermission,
  currentLocation,
  hasLocationPermission,
  navigation,
}) => {
  const searchedFromLocation = useOnlySingleLocation<NearbyScreenProp>(
    'location',
  );
  const [loadAnnouncement, setLoadAnnouncement] = useState<string>('');
  const styles = useNearbyStyles();

  const [searchTime, setSearchTime] = useState<SearchTime>({
    option: 'now',
    date: new Date().toISOString(),
  });

  const currentSearchLocation = useMemo<LocationWithMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [currentLocation],
  );
  const fromLocation = searchedFromLocation ?? currentSearchLocation;
  const updatingLocation = !fromLocation && hasLocationPermission;

  const {state, refresh} = useNearestStopsData(fromLocation);

  const {data, isLoading, error} = state;

  const isInitialScreen = data == null && !isLoading && !error;
  const activateScroll = !isInitialScreen || !!error;

  const {t, language} = useTranslation();

  const openLocationSearch = () =>
    navigation.navigate('LocationSearch', {
      label: t(NearbyTexts.search.label),
      callerRouteName: NearbyRouteNameStatic,
      callerRouteParam: 'location',
      initialLocation: fromLocation,
    });

  const {open: openBottomSheet} = useBottomSheet();
  const onLaterTimePress = () => {
    openBottomSheet((close, focusRef) => (
      <DepartureTimeSheet
        ref={focusRef}
        close={close}
        initialTime={searchTime}
        setSearchTime={setSearchTime}
      ></DepartureTimeSheet>
    ));
  };

  const onNowPress = () =>
    setSearchTime({
      option: 'now',
      date: new Date().toISOString(),
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

  useEffect(() => {
    if (searchedFromLocation?.layer === 'venue') {
      const loadedStopPlace = data?.find(
        (stopPlace) =>
          stopPlace.id === searchedFromLocation.id ||
          stopPlace.quays?.find(
            (quay) => quay.stopPlace.id === searchedFromLocation?.id,
          ),
      );
      if (loadedStopPlace)
        navigation.navigate('StopPlaceScreen', {
          stopPlaceDetails: loadedStopPlace,
        });
    }
  }, [searchedFromLocation, data]);

  return (
    <SimpleDisappearingHeader
      onRefresh={refresh}
      isRefreshing={isLoading}
      header={
        <Header
          fromLocation={fromLocation}
          updatingLocation={updatingLocation}
          openLocationSearch={openLocationSearch}
          setCurrentLocationOrRequest={setCurrentLocationOrRequest}
          onNowPress={onNowPress}
          onLaterTimePress={onLaterTimePress}
          searchTime={searchTime}
          setLocation={(location: LocationWithMetadata) => {
            navigation.setParams({
              location,
            });
          }}
        />
      }
      headerTitle={'New departures'}
      useScroll={activateScroll}
      leftButton={{type: 'home', color: themeColor}}
      alternativeTitleComponent={
        <AccessibleText
          prefix={t(NearbyTexts.header.altTitle.a11yPrefix)}
          type={'body__primary--bold'}
          color={themeColor}
        >
          {getHeaderAlternativeTitle(
            fromLocation?.name ?? '',
            searchTime,
            t,
            language,
          )}
        </AccessibleText>
      }
      // onEndReached={onScrollViewEndReached}
      alertContext={'travel'}
      setFocusOnLoad={true}
    >
      <ScreenReaderAnnouncement message={loadAnnouncement} />

      <View style={styles.container}>
        {data &&
          fromLocation &&
          sortStopPlaces(data, fromLocation?.coordinates).map(
            (stopPlace: StopPlaceDetails) => (
              <Sections.Section withPadding key={stopPlace.id}>
                <Sections.GenericClickableItem
                  onPress={() => {
                    navigation.navigate('StopPlaceScreen', {
                      stopPlaceDetails: stopPlace,
                    });
                  }}
                >
                  <View style={styles.stopPlaceContainer}>
                    <View style={styles.stopPlaceInfo}>
                      <ThemeText type="heading__component">
                        {stopPlace.name}
                      </ThemeText>
                      <ThemeText>
                        {stopPlace.description || 'Holdeplass'}
                      </ThemeText>
                      {stopPlace &&
                        stopPlace.latitude &&
                        stopPlace.longitude && (
                          <ThemeText>
                            {primitiveLocationDistanceInMetres(
                              stopPlace.latitude,
                              stopPlace.longitude,
                              fromLocation?.coordinates.latitude,
                              fromLocation?.coordinates.longitude,
                            ) + ' m'}
                          </ThemeText>
                        )}
                    </View>
                    {getTransportModeSvg(stopPlace.transportMode) && (
                      <ThemeIcon
                        style={styles.stopPlaceIcon}
                        size="large"
                        svg={
                          getTransportModeSvg(stopPlace.transportMode) ||
                          BusSide
                        }
                      ></ThemeIcon>
                    )}
                  </View>
                </Sections.GenericClickableItem>
              </Sections.Section>
            ),
          )}
      </View>
    </SimpleDisappearingHeader>
  );
};

type HeaderProps = {
  updatingLocation: boolean;
  fromLocation?: LocationWithMetadata;
  openLocationSearch: () => void;
  setCurrentLocationOrRequest(): Promise<void>;
  onNowPress: () => void;
  onLaterTimePress: () => void;
  searchTime: SearchTime;
  setLocation: (location: LocationWithMetadata) => void;
};

const Header = React.memo(function Header({
  updatingLocation,
  fromLocation,
  openLocationSearch,
  setCurrentLocationOrRequest,
  setLocation,
}: HeaderProps) {
  const {t} = useTranslation();

  const styles = useNearbyStyles();

  return (
    <>
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
            accessibilityLabel: t(
              NearbyTexts.location.locationButton.a11yLabel,
            ),
            accessibilityRole: 'button',
          }}
        />
      </Section>
      <FavoriteChips
        onSelectLocation={(location) => {
          setLocation(location);
        }}
        chipTypes={['favorites', 'add-favorite']}
        contentContainerStyle={styles.favoriteChips}
      ></FavoriteChips>
    </>
  );
});
const useNearbyStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingTop: theme.spacings.medium,
  },
  paddedContainer: {
    marginHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
    flexDirection: 'row',
    flex: 1,
    alignContent: 'space-between',
    borderStyle: 'solid',
    borderColor: theme.colors.primary_2.backgroundColor,
    borderWidth: 2,
    padding: 2,
    borderRadius: 12,
  },
  dateInputButtonContainer: {
    width: '50%',
  },
  dateInputButton: {
    color: theme.colors.primary_2.backgroundColor,
    padding: theme.spacings.small,
  },
  favoriteChips: {
    // @TODO Find solution for not hardcoding this. e.g. do proper math
    paddingRight: theme.spacings.medium / 2,
    paddingLeft: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
  stopPlaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexGrow: 1,
  },
  stopPlaceInfo: {
    flexShrink: 1,
  },
  stopPlaceIcon: {
    marginHorizontal: theme.spacings.medium,
  },
}));

function translateErrorType(
  errorType: ErrorType,
  t: TranslateFunction,
): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return t(NearbyTexts.messages.networkError);
    default:
      return t(NearbyTexts.messages.defaultFetchError);
  }
}

function getHeaderAlternativeTitle(
  locationName: string,
  searchTime: SearchTime,
  t: TFunc<typeof Language>,
  language: Language,
) {
  const time = formatToShortDateTimeWithoutYear(searchTime.date, language);

  switch (searchTime.option) {
    case 'now':
      return locationName;
    default:
      return t(NearbyTexts.header.departureFuture(locationName, time));
  }
}

function sortStopPlaces(
  data: StopPlaceDetails[],
  pos: Coordinates,
): StopPlaceDetails[] {
  return data.sort((a, b) => {
    if (a.latitude && a.longitude && b.latitude && b.longitude) {
      return (
        primitiveLocationDistanceInMetres(
          pos.latitude,
          pos.longitude,
          a.latitude,
          a.longitude,
        ) -
        primitiveLocationDistanceInMetres(
          pos.latitude,
          pos.longitude,
          b.latitude,
          b.longitude,
        )
      );
    }
    return -100000;
  });
}
