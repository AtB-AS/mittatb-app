import {Location as LocationIcon} from '@atb/assets/svg/mono-icons/places';
import SimpleDisappearingHeader from '@atb/components/disappearing-header/simple';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {LocationInput, Section} from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import FavoriteChips from '@atb/favorite-chips';
import {GeoLocation, Location} from '@atb/favorites/types';
import {
  RequestPermissionFn,
  useGeolocationState,
} from '@atb/GeolocationContext';
import {useOnlySingleLocation} from '@atb/location-search';
import {RootStackParamList} from '@atb/navigation';
import {StyleSheet} from '@atb/theme';
import {NearbyTexts, useTranslation} from '@atb/translations';
import {CompositeNavigationProp, RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import Loading from '../Loading';
import {useNearestStopsData} from './state/nearby-places-state';
import ThemeText from '@atb/components/text';
import {Place, StopPlacePosition} from '@atb/api/types/departures';
import {NearestStopPlacesQuery} from '@atb/api/types/generated/NearestStopPlacesQuery';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {DeparturesStackParams} from '.';
import StopPlaceItem from './components/StopPlaceItem';
import {useServiceDisruptionSheet} from '@atb/service-disruptions';
import {useDoOnceWhen} from '@atb/screens/utils';

const DateOptions = ['now', 'departure'] as const;
type DateOptionType = typeof DateOptions[number];
export type SearchTime = {
  option: DateOptionType;
  date: string;
};

type DeparturesRouteName = 'DeparturesRoot';
const NearbyRouteNameStatic: DeparturesRouteName = 'DeparturesRoot';

export type DepartureScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<DeparturesStackParams>,
  StackNavigationProp<RootStackParamList>
>;

export type NearbyPlacesParams = {
  location: Location;
};

export type DeparturesProps = RouteProp<
  DeparturesStackParams,
  DeparturesRouteName
>;

type RootProps = {
  navigation: DepartureScreenNavigationProp;
  route: DeparturesProps;
};

export default function NearbyPlacesScreen({navigation}: RootProps) {
  const {status, location, locationEnabled, requestPermission} =
    useGeolocationState();

  if (!status) {
    return <Loading />;
  }

  return (
    <PlacesOverview
      requestGeoPermission={requestPermission}
      hasLocationPermission={locationEnabled && status === 'granted'}
      currentLocation={location || undefined}
      navigation={navigation}
    />
  );
}

type PlacesOverviewProps = {
  currentLocation?: GeoLocation;
  hasLocationPermission: boolean;
  requestGeoPermission: RequestPermissionFn;
  navigation: DepartureScreenNavigationProp;
};

const PlacesOverview: React.FC<PlacesOverviewProps> = ({
  requestGeoPermission,
  currentLocation,
  hasLocationPermission,
  navigation,
}) => {
  const [loadAnnouncement, setLoadAnnouncement] = useState<string>('');
  const styles = useStyles();
  const {t} = useTranslation();

  const searchedFromLocation =
    useOnlySingleLocation<DeparturesProps>('location');

  useDoOnceWhen(setCurrentLocationAsFromIfEmpty, Boolean(currentLocation));
  const fromLocation = searchedFromLocation ?? currentLocation;

  const updatingLocation = !fromLocation && hasLocationPermission;

  const {state} = useNearestStopsData(fromLocation);

  const {data, isLoading, error} = state;
  const isInitialScreen = data == null && !isLoading && !error;
  const activateScroll = !isInitialScreen || !!error;

  const orderedStopPlaces = useMemo(
    () => sortAndFilterStopPlaces(data),
    [data],
  );

  const openLocationSearch = () =>
    navigation.navigate('LocationSearch', {
      label: t(NearbyTexts.search.label),
      callerRouteName: NearbyRouteNameStatic,
      callerRouteParam: 'location',
      initialLocation: fromLocation,
    });

  useEffect(() => {
    if (
      (fromLocation?.resultType == 'search' ||
        fromLocation?.resultType === 'favorite') &&
      fromLocation?.layer === 'venue'
    ) {
      navigation.navigate('PlaceScreen', {
        place: fromLocation,
      });
    }
  }, [fromLocation?.id]);

  function setCurrentLocationAsFrom() {
    navigation.setParams({
      location: currentLocation && {
        ...currentLocation,
        resultType: 'geolocation',
      },
    });
  }

  function setCurrentLocationAsFromIfEmpty() {
    if (fromLocation) {
      return;
    }
    setCurrentLocationAsFrom();
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

  const getListDescription = () => {
    if (!fromLocation) return;
    switch (fromLocation.resultType) {
      case 'geolocation':
        return t(DeparturesTexts.stopPlaceList.listDescription.geoLoc);
      case 'search':
      case 'favorite':
        return (
          t(DeparturesTexts.stopPlaceList.listDescription.address) +
          fromLocation.name
        );
      case undefined:
        return;
    }
  };

  const navigateToPlace = (place: Place) => {
    navigation.navigate('PlaceScreen', {
      place,
    });
  };
  const {leftButton} = useServiceDisruptionSheet();

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

  function refresh() {
    navigation.setParams({
      location:
        fromLocation?.resultType === 'geolocation'
          ? currentLocation
          : fromLocation,
    });
  }

  return (
    <SimpleDisappearingHeader
      onRefresh={refresh}
      isRefreshing={isLoading}
      leftButton={leftButton}
      header={
        <Header
          fromLocation={fromLocation}
          updatingLocation={updatingLocation}
          openLocationSearch={openLocationSearch}
          setCurrentLocationOrRequest={setCurrentLocationOrRequest}
          setLocation={(location: Location) => {
            location.resultType === 'search' && location.layer === 'venue'
              ? navigation.navigate('PlaceScreen', {
                  place: location as Place,
                })
              : navigation.setParams({
                  location,
                });
          }}
        />
      }
      headerTitle={t(DeparturesTexts.header.title)}
      useScroll={activateScroll}
      alertContext={'travel'}
      setFocusOnLoad={true}
    >
      <ScreenReaderAnnouncement message={loadAnnouncement} />

      <View style={styles.container} testID="nearbyStopsContainerView">
        <ThemeText
          style={styles.listDescription}
          type="body__secondary"
          color="secondary"
        >
          {getListDescription()}
        </ThemeText>
        {orderedStopPlaces.map((stopPlacePosition: StopPlacePosition) => (
          <StopPlaceItem
            key={stopPlacePosition.node?.place?.id}
            stopPlacePosition={stopPlacePosition}
            onPress={navigateToPlace}
            testID={
              'stopPlaceItem' + orderedStopPlaces.indexOf(stopPlacePosition)
            }
          />
        ))}
      </View>
    </SimpleDisappearingHeader>
  );
};

type HeaderProps = {
  updatingLocation: boolean;
  fromLocation?: Location;
  openLocationSearch: () => void;
  setCurrentLocationOrRequest(): Promise<void>;
  setLocation: (location: Location) => void;
};

const Header = React.memo(function Header({
  updatingLocation,
  fromLocation,
  openLocationSearch,
  setCurrentLocationOrRequest,
  setLocation,
}: HeaderProps) {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <>
      <Section withPadding>
        <LocationInput
          label={t(NearbyTexts.location.departurePicker.label)}
          updatingLocation={updatingLocation}
          location={fromLocation}
          onPress={openLocationSearch}
          accessibilityLabel={t(NearbyTexts.location.departurePicker.a11yLabel)}
          icon={<ThemeIcon svg={LocationIcon} />}
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
      />
    </>
  );
});

function sortAndFilterStopPlaces(
  data: NearestStopPlacesQuery | null,
): StopPlacePosition[] {
  const edges = data?.nearest?.edges;
  if (!edges) return [];

  // Sort StopPlaces on distance from search location
  const sortedEdges = edges?.sort((edgeA, edgeB) => {
    if (edgeA.node?.distance === undefined) return 1;
    if (edgeB.node?.distance === undefined) return -1;
    return edgeA.node?.distance > edgeB.node?.distance ? 1 : -1;
  });

  // Remove all StopPlaces without Quays
  const filteredEdges = sortedEdges.filter(
    (place: StopPlacePosition) => place.node?.place?.quays?.length,
  );

  return filteredEdges;
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingVertical: theme.spacings.medium,
  },
  favoriteChips: {
    // @TODO Find solution for not hardcoding this. e.g. do proper math
    paddingRight: theme.spacings.medium / 2,
    paddingLeft: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
  listDescription: {
    paddingVertical: theme.spacings.medium,
    paddingHorizontal: theme.spacings.medium * 2,
  },
}));
