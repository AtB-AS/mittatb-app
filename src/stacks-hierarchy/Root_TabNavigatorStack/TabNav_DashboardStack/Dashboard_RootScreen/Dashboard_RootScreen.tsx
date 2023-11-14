import {useGeolocationState} from '@atb/GeolocationContext';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {useAnalytics} from '@atb/analytics';
import {DashboardBackground} from '@atb/assets/svg/color/images';
import {Swap} from '@atb/assets/svg/mono-icons/actions';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {FullScreenHeader} from '@atb/components/screen-header';
import {LocationInputSectionItem, Section} from '@atb/components/sections';
import {screenReaderPause} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  FavoriteChips,
  GeoLocation,
  Location,
  UserFavorites,
  useFavorites,
} from '@atb/favorites';
import {GlobalMessageContextEnum} from '@atb/global-messages';
import {
  SelectableLocationType,
  useLocationSearchValue,
} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {SearchForLocations} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {
  DashboardTexts,
  TripSearchTexts,
  dictionary,
  useTranslation,
} from '@atb/translations';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import Bugsnag from '@bugsnag/react-native';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {DashboardScreenProps} from '../navigation-types';
import {CompactFareContracts} from './components/CompactFareContracts';
import {DeparturesWidget} from './components/DeparturesWidget';
import {Announcements} from './components/Announcements';

type DashboardRouteName = 'Dashboard_RootScreen';
const DashboardRouteNameStatic: DashboardRouteName = 'Dashboard_RootScreen';

type RootProps = DashboardScreenProps<'Dashboard_RootScreen'>;

const themeBackgroundColor: StaticColorByType<'background'> =
  'background_accent_0';

export const Dashboard_RootScreen: React.FC<RootProps> = ({
  navigation,
  route,
}) => {
  const style = useStyle();
  const {t} = useTranslation();
  const {enable_ticketing} = useRemoteConfig();
  const [updatingLocation, setUpdatingLocation] = useState<boolean>(false);
  const analytics = useAnalytics();

  const {
    status,
    locationEnabled,
    location,
    requestPermission: requestGeoPermission,
  } = useGeolocationState();

  const hasLocationPermission = locationEnabled && status === 'granted';
  const currentLocation = location || undefined;

  useDoOnceWhen(
    () => setUpdatingLocation(true),
    !Boolean(currentLocation) && hasLocationPermission,
  );
  useDoOnceWhen(
    () => setUpdatingLocation(false),
    Boolean(currentLocation) && hasLocationPermission,
  );
  useDoOnceWhen(setCurrentLocationAsFromIfEmpty, Boolean(currentLocation));

  function setCurrentLocationAsFromIfEmpty() {
    if (from) {
      return;
    }
    setCurrentLocationAsFrom();
  }
  const {from, to} = useLocations(currentLocation);
  useEffect(() => {
    if (!!to && !!from) {
      const toLocation = to;
      const fromLocation = from;

      // Reset search params before navigating to TripSearch in order to prevent
      // the search fields from both being filled (which is an invalid state)
      // when navigating back.
      reset();

      navigation.navigate('Dashboard_TripSearchScreen', {
        fromLocation,
        toLocation,
        searchTime: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, from, navigation]);

  const setCurrentLocationAsFrom = useCallback(
    function setCurrentLocationAsFrom() {
      log('set_current_location_as_from');
      navigation.setParams({
        fromLocation: currentLocation && {
          ...currentLocation,
          resultType: 'geolocation',
        },
        toLocation: to,
      });
    },
    [navigation, currentLocation, to],
  );

  const openLocationSearch = (
    callerRouteParam: keyof RootProps['route']['params'],
    initialLocation: Location | undefined,
  ) =>
    navigation.navigate('Root_LocationSearchByTextScreen', {
      label:
        callerRouteParam === 'fromLocation'
          ? t(TripSearchTexts.location.departurePicker.label)
          : t(TripSearchTexts.location.destinationPicker.label),
      callerRouteName: DashboardRouteNameStatic,
      callerRouteParam,
      initialLocation,
      includeJourneyHistory: true,
    });

  const setCurrentLocationOrRequest = useCallback(
    async function setCurrentLocationOrRequest() {
      if (currentLocation) {
        setCurrentLocationAsFrom();
      } else {
        const status = await requestGeoPermission();
        if (status === 'granted') {
          setCurrentLocationAsFrom();
        }
      }
    },
    [currentLocation, setCurrentLocationAsFrom, requestGeoPermission],
  );

  function swap() {
    log('swap', {
      newFrom: translateLocation(to),
      newTo: translateLocation(from),
    });
    navigation.setParams({fromLocation: to, toLocation: from});
  }

  function reset() {
    setCurrentLocationAsFrom();
    navigation.setParams({toLocation: undefined});
  }

  function fillNextAvailableLocation(selectedLocation: Location) {
    if (!from) {
      navigation.setParams({
        fromLocation: selectedLocation,
        toLocation: to,
      });
    } else {
      navigation.setParams({
        fromLocation: from,
        toLocation: selectedLocation,
      });
    }
  }

  return (
    <View style={style.container}>
      <FullScreenHeader
        title={t(DashboardTexts.header.title)}
        rightButton={{type: 'chat'}}
        leftButton={{type: 'status-disruption'}}
        globalMessageContext={GlobalMessageContextEnum.appAssistant}
      />

      <View style={style.backdrop}>
        <DashboardBackground width="100%" height="100%" />
      </View>

      <ScrollView
        contentContainerStyle={style.scrollView}
        testID="dashboardScrollView"
      >
        <View style={style.searchHeader}>
          <Section style={[style.contentSection, style.contentSection__first]}>
            <LocationInputSectionItem
              accessibilityLabel={
                t(TripSearchTexts.location.departurePicker.a11yLabel) +
                screenReaderPause
              }
              accessibilityHint={
                t(TripSearchTexts.location.departurePicker.a11yHint) +
                screenReaderPause
              }
              updatingLocation={updatingLocation && !to}
              location={from}
              label={t(TripSearchTexts.location.departurePicker.label)}
              onPress={() => openLocationSearch('fromLocation', from)}
              icon={<ThemeIcon svg={LocationIcon} />}
              onIconPress={setCurrentLocationOrRequest}
              iconAccessibility={{
                accessible: true,
                accessibilityLabel:
                  from?.resultType == 'geolocation'
                    ? t(
                        TripSearchTexts.location.locationButton.a11yLabel
                          .update,
                      )
                    : t(TripSearchTexts.location.locationButton.a11yLabel.use),
                accessibilityRole: 'button',
              }}
              testID="searchFromButton"
            />

            <LocationInputSectionItem
              accessibilityLabel={t(
                TripSearchTexts.location.destinationPicker.a11yLabel,
              )}
              label={t(TripSearchTexts.location.destinationPicker.label)}
              location={to}
              onPress={() => openLocationSearch('toLocation', to)}
              icon={<ThemeIcon svg={Swap} />}
              onIconPress={swap}
              iconAccessibility={{
                accessible: true,
                accessibilityLabel:
                  t(TripSearchTexts.location.swapButton.a11yLabel) +
                  screenReaderPause,
                accessibilityRole: 'button',
              }}
              testID="searchToButton"
            />
          </Section>

          <FavoriteChips
            key="favoriteChips"
            style={style.favoriteChips}
            chipTypes={['favorites', 'add-favorite']}
            onSelectLocation={fillNextAvailableLocation}
            chipActionHint={
              t(TripSearchTexts.favorites.favoriteChip.a11yHint) +
              t(!!from ? dictionary.toPlace : dictionary.fromPlace) +
              screenReaderPause
            }
            onAddFavorite={() =>
              navigation.navigate('Root_SearchStopPlaceScreen')
            }
          />
        </View>

        <Announcements style={style.contentSection} />

        {enable_ticketing && (
          <CompactFareContracts
            style={style.contentSection}
            onPressDetails={(
              isCarnet: boolean,
              orderId: string,
            ) => {
              if (isCarnet) {
                return navigation.navigate({
                  name: 'Root_CarnetDetailsScreen',
                  params: {
                    orderId,
                  },
                });
              }

              return navigation.navigate({
                name: 'Root_FareContractDetailsScreen',
                params: {orderId},
              });
            }}
            onPressBuy={() => {
              analytics.logEvent('Dashboard', 'Purchase ticket button clicked');
              navigation.navigate('TabNav_TicketingStack', {
                screen: 'Ticketing_RootScreen',
                params: {
                  screen: 'TicketTabNav_PurchaseTabScreen',
                },
              });
            }}
          />
        )}
        <DeparturesWidget
          style={style.contentSection}
          onEditFavouriteDeparture={() =>
            navigation.navigate('Dashboard_FavoriteDeparturesScreen')
          }
          onAddFavouriteDeparture={() =>
            navigation.navigate('Dashboard_NearbyStopPlacesScreen', {
              mode: 'Favourite',
              location: undefined,
              onCloseRoute: route.name,
            })
          }
          onPressDeparture={(items, activeItemIndex) =>
            navigation.navigate('Dashboard_DepartureDetailsScreen', {
              items,
              activeItemIndex,
            })
          }
        />
      </ScrollView>
    </View>
  );
};

function useLocations(
  currentLocation: GeoLocation | undefined,
): SearchForLocations {
  const {favorites} = useFavorites();

  const memoedCurrentLocation = useMemo<GeoLocation | undefined>(
    () => currentLocation,
      // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentLocation?.coordinates.latitude,
      currentLocation?.coordinates.longitude,
    ],
  );

  const searchedFromLocation =
    useLocationSearchValue<RootProps['route']>('fromLocation');
  const searchedToLocation =
    useLocationSearchValue<RootProps['route']>('toLocation');

  return useUpdatedLocation(
    searchedFromLocation,
    searchedToLocation,
    memoedCurrentLocation,
    favorites,
  );
}

function useUpdatedLocation(
  searchedFromLocation: SelectableLocationType | undefined,
  searchedToLocation: SelectableLocationType | undefined,
  currentLocation: GeoLocation | undefined,
  favorites: UserFavorites,
): SearchForLocations {
  const [from, setFrom] = useState<Location | undefined>();
  const [to, setTo] = useState<Location | undefined>();
  const navigation = useNavigation<RootProps['navigation']>();

  const setLocation = useCallback(
    (direction: 'from' | 'to', searchedLocation?: SelectableLocationType) => {
      const updater = direction === 'from' ? setFrom : setTo;
      if (!searchedLocation) return updater(searchedLocation);

      switch (searchedLocation.resultType) {
        case 'search':
        case 'geolocation':
          return updater(searchedLocation);
        case 'journey': {
          const toSearch = (i: number): Location => ({
            ...searchedLocation.journeyData[i],
            resultType: 'search',
          });

          // Set both states when journey is passed.
          navigation.setParams({
            fromLocation: toSearch(0),
            toLocation: toSearch(1),
          });
          return;
        }
        case 'favorite': {
          const favorite = favorites.find(
            (f) => f.id === searchedLocation.favoriteId,
          );

          if (favorite) {
            return updater(favorite.location);
          }
        }
      }
    },
      // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLocation, favorites],
  );

  // Override from state on change
  useEffect(() => {
    setLocation('from', searchedFromLocation);
  }, [searchedFromLocation, setLocation]);

  // Override to state on change
  useEffect(() => {
    setLocation('to', searchedToLocation);
  }, [searchedToLocation, setLocation]);

  return {from, to};
}

function log(message: string, metadata?: {[key: string]: string}) {
  Bugsnag.leaveBreadcrumb(message, {component: 'Dashboard', ...metadata});
}

function translateLocation(location: Location | undefined): string {
  if (!location) return 'Undefined location';
  if (location.resultType === 'geolocation') {
    return location.id;
  }
  return `${location.id}--${location.name}--${location.locality}`;
}

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background[themeBackgroundColor].background,
    flex: 1,
  },
  scrollView: {
    paddingBottom: theme.spacings.medium,
    backgroundColor: 'transparent',
  },
  backdrop: {
    position: 'absolute',
    height: 250,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 0,
    margin: 0,
  },
  contentSection: {
    marginTop: theme.spacings.large,
    marginHorizontal: theme.spacings.medium,
  },
  contentSection__first: {
    marginTop: 0,
  },
  favoriteChips: {
    marginTop: theme.spacings.medium,
    paddingHorizontal: theme.spacings.medium,
  },
  searchHeader: {
    marginTop: 0,
    backgroundColor: theme.static.background[themeBackgroundColor].background,
  },
  dashboardGlobalmessages: {
    marginBottom: theme.spacings.medium,
  },
}));
