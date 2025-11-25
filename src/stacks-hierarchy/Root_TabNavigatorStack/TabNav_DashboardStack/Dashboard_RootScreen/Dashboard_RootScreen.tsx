import {useGeolocationContext} from '@atb/modules/geolocation';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {Swap} from '@atb/assets/svg/mono-icons/actions';
import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import {
  GenericSectionItem,
  LinkSectionItem,
  LocationInputSectionItem,
  Section,
} from '@atb/components/sections';
import {screenReaderPause} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
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
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {DashboardScreenProps} from '../navigation-types';
import {CompactFareContracts} from '@atb/modules/fare-contracts';
import {DeparturesWidget} from './components/DeparturesWidget';
import {Announcements} from './components/Announcements';
import SharedTexts from '@atb/translations/shared';
import {FullScreenView} from '@atb/components/screen-view';
import {ContentHeading, ScreenHeading} from '@atb/components/heading';
import {UserBonusBalanceContent} from '@atb/modules/bonus';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useNavigateNestedProfileScreen} from '@atb/utils/use-navigate-to-nested-profile-screen';

type DashboardRouteName = 'Dashboard_RootScreen';
const DashboardRouteNameStatic: DashboardRouteName = 'Dashboard_RootScreen';

type RootProps = DashboardScreenProps<'Dashboard_RootScreen'>;

export const Dashboard_RootScreen: React.FC<RootProps> = ({
  navigation,
  route,
}) => {
  const style = useStyle();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const {enable_ticketing} = useRemoteConfigContext();
  const [updatingLocation, setUpdatingLocation] = useState<boolean>(false);
  const analytics = useAnalyticsContext();

  const {isBonusProgramEnabled} = useFeatureTogglesContext();
  const navigateToBonusScreen = useNavigateNestedProfileScreen(
    'Profile_BonusScreen',
  );
  const {locationIsAvailable, location, requestLocationPermission} =
    useGeolocationContext();

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
          ? t(SharedTexts.from)
          : t(SharedTexts.to),
      callerRouteName: DashboardRouteNameStatic,
      callerRouteParam,
      initialLocation,
      includeJourneyHistory: true,
      onlyStopPlacesCheckboxInitialState: false,
    });

  const setCurrentLocationOrRequest = useCallback(async () => {
    if (currentLocation) {
      setCurrentLocationAsFrom();
    } else {
      const status = await requestLocationPermission(false);
      if (status === 'granted') {
        setCurrentLocationAsFrom();
      }
    }
  }, [currentLocation, setCurrentLocationAsFrom, requestLocationPermission]);

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
    <FullScreenView
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
              label={t(SharedTexts.from)}
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
              label={t(SharedTexts.to)}
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
          <View style={style.contentSection}>
            <ContentHeading
              text={t(DashboardTexts.bonus.header)}
              style={style.heading}
            />
            <Section>
              <GenericSectionItem>
                <UserBonusBalanceContent />
              </GenericSectionItem>
              <LinkSectionItem
                text={t(DashboardTexts.bonus.button)}
                onPress={() => {
                  analytics.logEvent(
                    'Bonus',
                    'Dashboard bonus info button clicked',
                  );
                  navigateToBonusScreen();
                }}
              />
            </Section>
          </View>
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
    </FullScreenView>
  );
};

function useLocations(
  currentLocation: GeoLocation | undefined,
): SearchForLocations {
  const {favorites} = useFavoritesContext();

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
}));
