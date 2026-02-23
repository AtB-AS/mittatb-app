import {useGeolocationContext} from '@atb/modules/geolocation';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {LocationInputSectionItem, Section} from '@atb/components/sections';
import {screenReaderPause} from '@atb/components/text';
import {
  FavoriteChips,
  GeoLocation,
  Location,
  UserFavorites,
  useFavoritesContext,
} from '@atb/modules/favorites';
import {GlobalMessageContextEnum} from '@atb/modules/global-messages';
import {
  SelectableLocationType,
  useLocationSearchValue,
} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {SearchForLocations} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {
  DashboardTexts,
  TripSearchTexts,
  dictionary,
  useTranslation,
} from '@atb/translations';
import {useDoOnceWhen} from '@atb/utils/use-do-once-when';
import Bugsnag from '@bugsnag/react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {DashboardScreenProps} from '../navigation-types';
import {CompactFareContracts} from '@atb/modules/fare-contracts';
import {DeparturesWidget} from './components/DeparturesWidget';
import {Announcements} from './components/Announcements';
import SharedTexts from '@atb/translations/shared';
import {FullScreenView} from '@atb/components/screen-view';
import {ScreenHeading} from '@atb/components/heading';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {BonusDashboard} from './components/BonusDashboard';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {useNestedProfileScreenParams} from '@atb/utils/use-nested-profile-screen-params';
import {LocationSearchCallerRoute} from '@atb/stacks-hierarchy/Root_LocationSearchByTextScreen';
import {Swap} from '@atb/assets/svg/mono-icons/actions';
import {WithOverlayButton} from '@atb/components/overlay-button';

type RootProps = DashboardScreenProps<'Dashboard_RootScreen'>;
const callerRoute: LocationSearchCallerRoute = [
  'Root_TabNavigatorStack',
  {
    screen: 'TabNav_DashboardStack',
    params: {
      screen: 'Dashboard_RootScreen',
      params: {},
      merge: true,
    },
  },
];

export const Dashboard_RootScreen: React.FC<RootProps> = ({navigation}) => {
  const style = useStyle();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const {enable_ticketing} = useRemoteConfigContext();
  const [updatingLocation, setUpdatingLocation] = useState<boolean>(false);
  const analytics = useAnalyticsContext();

  const {isBonusProgramEnabled} = useFeatureTogglesContext();
  const {locationIsAvailable, location} = useGeolocationContext();
  const focusRef = useFocusOnLoad(navigation);

  const currentLocation = location || undefined;

  useDoOnceWhen(
    () => setUpdatingLocation(true),
    !Boolean(currentLocation) && locationIsAvailable,
  );
  useDoOnceWhen(
    () => setUpdatingLocation(false),
    Boolean(currentLocation) && locationIsAvailable,
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

      navigation.push('Dashboard_TripSearchScreen', {
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
          ? t(SharedTexts.from)
          : t(SharedTexts.to),
      callerRouteConfig: {
        route: callerRoute,
        locationRouteParam: callerRouteParam,
      },
      initialLocation,
      includeJourneyHistory: true,
      onlyStopPlacesCheckboxInitialState: false,
    });

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

  const bonusScreenParams = useNestedProfileScreenParams('Profile_BonusScreen');

  const navigateToBonusScreen = useCallback(() => {
    navigation.navigate('Root_TabNavigatorStack', bonusScreenParams);
  }, [navigation, bonusScreenParams]);

  const navigateToFavoriteDeparturesScreen = useCallback(() => {
    navigation.navigate('Dashboard_FavoriteDeparturesScreen');
  }, [navigation]);

  const navigateToNearbyStopPlacesScreen = useCallback(() => {
    navigation.navigate('Dashboard_NearbyStopPlacesScreen', {
      location: undefined,
      onCompleteRouteName: 'Dashboard_RootScreen',
    });
  }, [navigation]);

  const navigateToDepartureDetailsScreen = useCallback(
    (items: any[], activeItemIndex: number) => {
      navigation.navigate('Dashboard_DepartureDetailsScreen', {
        items,
        activeItemIndex,
      });
    },
    [navigation],
  );

  return (
    <FullScreenView
      focusRef={focusRef}
      headerProps={{
        title: t(DashboardTexts.header.title),
        globalMessageContext: GlobalMessageContextEnum.appAssistant,
        color: theme.color.background.neutral[1],
      }}
      parallaxContent={(focusRef) => (
        <ScreenHeading
          ref={focusRef}
          text={t(DashboardTexts.header.title)}
          isLarge={true}
        />
      )}
    >
      <ScrollView
        contentContainerStyle={style.scrollView}
        testID="dashboardScrollView"
      >
        <View style={style.searchHeader}>
          <WithOverlayButton
            svgIcon={Swap}
            onPress={swap}
            overlayPosition="right"
            isLoading={updatingLocation && !to}
            buttonStyleOverride={style.swapButton}
          >
            <Section
              style={[style.contentSection, style.contentSection__first]}
            >
              <LocationInputSectionItem
                accessibilityLabel={
                  t(TripSearchTexts.location.departurePicker.a11yLabel) +
                  screenReaderPause
                }
                accessibilityHint={
                  t(TripSearchTexts.location.departurePicker.a11yHint) +
                  screenReaderPause
                }
                location={from}
                label={t(SharedTexts.from)}
                onPress={() => openLocationSearch('fromLocation', from)}
                testID="searchFromButton"
              />
              <LocationInputSectionItem
                accessibilityLabel={t(
                  TripSearchTexts.location.destinationPicker.a11yLabel,
                )}
                label={t(SharedTexts.to)}
                location={to}
                onPress={() => openLocationSearch('toLocation', to)}
                testID="searchToButton"
              />
            </Section>
          </WithOverlayButton>

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
            onAddFavoritePlace={() =>
              navigation.navigate('Root_SearchFavoritePlaceScreen')
            }
            backgroundColor={theme.color.background.neutral[1]}
          />
        </View>
        <Announcements
          style={[style.contentSection, style.contentSection__horizontalScroll]}
        />

        {enable_ticketing && (
          <CompactFareContracts
            style={style.contentSection}
            onPressDetails={(fareContractId: string) => {
              return navigation.navigate({
                name: 'Root_FareContractDetailsScreen',
                params: {
                  fareContractId: fareContractId,
                  transitionOverride: 'slide-from-right',
                },
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
        {isBonusProgramEnabled && (
          <BonusDashboard onPress={navigateToBonusScreen} />
        )}
        <DeparturesWidget
          style={style.contentSection}
          onEditFavouriteDeparture={navigateToFavoriteDeparturesScreen}
          onAddFavouriteDeparture={navigateToNearbyStopPlacesScreen}
          onPressDeparture={navigateToDepartureDetailsScreen}
        />
      </ScrollView>
    </FullScreenView>
  );
};

function useLocations(
  currentLocation: GeoLocation | undefined,
): SearchForLocations {
  const route = useRoute<RootProps['route']>();
  const {favorites} = useFavoritesContext();

  const memoedCurrentLocation = useMemo<GeoLocation | undefined>(
    () => currentLocation,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      currentLocation?.coordinates.latitude,
      currentLocation?.coordinates.longitude,
    ],
  );

  const searchedFromLocation = useLocationSearchValue(route, 'fromLocation');
  const searchedToLocation = useLocationSearchValue(route, 'toLocation');

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
  scrollView: {
    paddingBottom: theme.spacing.medium,
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
    marginTop: theme.spacing.medium,
    marginHorizontal: theme.spacing.medium,
  },
  contentSection__horizontalScroll: {
    marginHorizontal: 0,
  },
  contentSection__first: {
    marginTop: 0,
  },
  favoriteChips: {
    marginTop: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  searchHeader: {
    marginTop: 0,
    paddingBottom: theme.spacing.medium,
  },
  dashboardGlobalmessages: {
    marginBottom: theme.spacing.medium,
  },
  heading: {
    marginBottom: theme.spacing.small,
  },
  swapButton: {
    marginRight: theme.spacing.medium,
  },
}));
