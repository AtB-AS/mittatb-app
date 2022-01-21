import {CurrentLocationArrow} from '@atb/assets/svg/icons/places';
import SimpleDisappearingHeader from '@atb/components/disappearing-header/simple';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {LocationInput, Section} from '@atb/components/sections';
import ThemeIcon from '@atb/components/theme-icon';
import FavoriteChips from '@atb/favorite-chips';
import {Location, LocationWithMetadata} from '@atb/favorites/types';
import {useReverseGeocoder} from '@atb/geocoder';
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
import {useNearestStopsData} from './state/NearbyPlacesState';
import ThemeText from '@atb/components/text';
import * as Sections from '@atb/components/sections';
import {BusSide} from '@atb/assets/svg/icons/transportation';
import {getTransportModeSvg} from '@atb/components/transportation-icon';
import {StopPlacePosition} from '@atb/api/types/departures';
import {NearestStopPlacesQuery} from '@atb/api/types/generated/NearestStopPlacesQuery';
import DeparturesTexts from '@atb/translations/screens/Departures';
import {DeparturesStackParams} from '.';

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
  location: LocationWithMetadata;
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
  navigation: DepartureScreenNavigationProp;
};

const DeparturesOverview: React.FC<Props> = ({
  requestGeoPermission,
  currentLocation,
  hasLocationPermission,
  navigation,
}) => {
  const [loadAnnouncement, setLoadAnnouncement] = useState<string>('');
  const styles = useStyles();
  const {t} = useTranslation();

  const searchedFromLocation = useOnlySingleLocation<DeparturesProps>(
    'location',
  );
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

  const orderedStopPlaces = useMemo(() => sortAndFilterStopPlaces(data), [
    data,
  ]);

  const openLocationSearch = () =>
    navigation.navigate('LocationSearch', {
      label: t(NearbyTexts.search.label),
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

  const getListDescription = () => {
    if (!fromLocation || !fromLocation.name) return;
    switch (fromLocation?.resultType) {
      case 'geolocation':
        return t(DeparturesTexts.stopPlaceList.listDescription.geoLoc);
      case 'favorite':
      case 'search':
        return (
          t(DeparturesTexts.stopPlaceList.listDescription.address) +
          fromLocation?.name
        );
      case undefined:
        return;
    }
  };

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
          setLocation={(location: LocationWithMetadata) => {
            navigation.setParams({
              location,
            });
          }}
        />
      }
      headerTitle={t(DeparturesTexts.header.title)}
      useScroll={activateScroll}
      leftButton={{type: 'home', color: 'background_accent'}}
      alertContext={'travel'}
      setFocusOnLoad={true}
    >
      <ScreenReaderAnnouncement message={loadAnnouncement} />

      <View style={styles.container}>
        <ThemeText
          style={styles.listDescription}
          type="body__secondary"
          color="secondary"
        >
          {getListDescription()}
        </ThemeText>
        {orderedStopPlaces.map((stopPlace: StopPlacePosition) => (
          <Sections.Section withPadding key={stopPlace.node?.place?.id}>
            <Sections.GenericClickableItem
              onPress={() => {
                navigation.navigate('PlaceScreen', {
                  stopPlacePosition: stopPlace,
                });
              }}
            >
              <View style={styles.stopPlaceContainer}>
                <View style={styles.stopPlaceInfo}>
                  <ThemeText type="heading__component">
                    {stopPlace.node?.place?.name}
                  </ThemeText>
                  <ThemeText
                    type="body__secondary"
                    style={styles.stopDescription}
                  >
                    {stopPlace.node?.place?.description ||
                      t(DeparturesTexts.stopPlaceList.stopPlace)}
                  </ThemeText>
                  <ThemeText type="body__secondary" color="secondary">
                    {stopPlace.node?.distance?.toFixed(0) + ' m'}
                  </ThemeText>
                </View>
                {stopPlace.node?.place?.transportMode?.map((mode) => (
                  <ThemeIcon
                    style={styles.stopPlaceIcon}
                    size="large"
                    svg={getTransportModeSvg(mode) || BusSide}
                  ></ThemeIcon>
                ))}
              </View>
            </Sections.GenericClickableItem>
          </Sections.Section>
        ))}
      </View>
    </SimpleDisappearingHeader>
  );
};

type HeaderProps = {
  updatingLocation: boolean;
  fromLocation?: LocationWithMetadata;
  openLocationSearch: () => void;
  setCurrentLocationOrRequest(): Promise<void>;
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

function sortAndFilterStopPlaces(
  data: NearestStopPlacesQuery | null,
): StopPlacePosition[] {
  const edges = data?.nearest?.edges;
  if (!edges) return [];

  // Sort StopPlaces on distance from search location
  const sortedEdges = edges?.sort((edgeA, edgeB) => {
    if (!edgeA.node?.distance) return 1;
    if (!edgeB.node?.distance) return -1;
    return edgeA.node?.distance > edgeB.node?.distance ? 1 : -1;
  });

  // Remove all StopPlaces without Quays
  const filteredEdges = sortedEdges.filter(
    (stopPlace: StopPlacePosition) => stopPlace.node?.place?.quays?.length,
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
  stopPlaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexGrow: 1,
  },
  stopPlaceInfo: {
    flexShrink: 1,
    flexGrow: 1,
  },
  stopDescription: {
    marginVertical: theme.spacings.xSmall,
  },
  stopPlaceIcon: {
    marginLeft: theme.spacings.medium,
  },
}));
