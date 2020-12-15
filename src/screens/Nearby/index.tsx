import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useMemo, useState} from 'react';
import {ErrorType} from '../../api/utils';
import {CurrentLocationArrow} from '../../assets/svg/icons/places';
import AccessibleText, {
  screenReaderPause,
} from '../../components/accessible-text';
import DisappearingHeader from '../../components/disappearing-header';
import ScreenReaderAnnouncement from '../../components/screen-reader-announcement';
import {LocationInput, Section} from '../../components/sections';
import ThemeIcon from '../../components/theme-icon';
import FavoriteChips from '../../favorite-chips';
import {Location, LocationWithMetadata} from '../../favorites/types';
import {useReverseGeocoder} from '../../geocoder';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '../../GeolocationContext';
import {useLocationSearchValue} from '../../location-search';
import {RootStackParamList} from '../../navigation';
import {TabNavigatorParams} from '../../navigation/TabNavigator';
import {useTheme} from '../../theme';
import {
  AssistantTexts,
  dictionary,
  NearbyTexts,
  TranslatedString,
  useTranslation,
} from '../../translations/';
import {useNavigateToStartScreen} from '../../utils/navigation';
import Loading from '../Loading';
import NearbyResults from './NearbyResults';
import {useDepartureData} from './state';

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

  const {closestLocation: currentLocation} = useReverseGeocoder(
    location?.coords ?? null,
  );

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
  const {theme} = useTheme();

  const currentSearchLocation = useMemo<LocationWithMetadata | undefined>(
    () => currentLocation && {...currentLocation, resultType: 'geolocation'},
    [currentLocation],
  );
  const fromLocation = searchedFromLocation ?? currentSearchLocation;
  const updatingLocation = !fromLocation && hasLocationPermission;
  const {state, refresh, loadMore} = useDepartureData(fromLocation);
  const {data, lastUpdated, isLoading, isFetchingMore, error} = state;

  const isInitialScreen = data == null && !isLoading && !error;
  const activateScroll = !isInitialScreen || !!error;
  const isGeoLocationActive = fromLocation?.resultType == 'geolocation';

  const {t} = useTranslation();

  const onScrollViewEndReached = () => data?.length && loadMore();

  const openLocationSearch = () =>
    navigation.navigate('LocationSearch', {
      label: 'Fra',
      callerRouteName: NearbyRouteNameStatic,
      callerRouteParam: 'location',
      initialLocation: fromLocation,
    });

  const fullLocation = (selectedLocation: LocationWithMetadata) => {
    navigation.setParams({
      location: selectedLocation,
    });
  };

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
      {isGeoLocationActive && (
        <FavoriteChips
          key="favoriteChips"
          chipTypes={['favorites', 'add-favorite']}
          onSelectLocation={fullLocation}
          containerStyle={{
            marginTop: theme.spacings.xSmall,
            marginBottom: theme.spacings.medium,
          }}
          contentContainerStyle={{
            // @TODO Find solution for not hardcoding this. e.g. do proper math
            paddingLeft: theme.spacings.medium,
            paddingRight: theme.spacings.medium / 2,
          }}
          chipActionHint={
            t(AssistantTexts.favorites.favoriteChip.a11yHint) +
            t(dictionary.toPlace) +
            screenReaderPause
          }
        />
      )}
    </>
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
        currentLocation={currentLocation}
        departures={data}
        lastUpdated={lastUpdated}
        isFetchingMore={isFetchingMore && !isLoading}
        isInitialScreen={isInitialScreen}
        error={error ? t(translateErrorType(error.type)) : undefined}
      />
    </DisappearingHeader>
  );
};

function translateErrorType(errorType: ErrorType): TranslatedString {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return NearbyTexts.messages.networkError;
    default:
      return NearbyTexts.messages.defaultFetchError;
  }
}

export default NearbyScreen;
