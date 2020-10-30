import {RouteProp, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {TextInput, View, Keyboard} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Header from '../ScreenHeader';
import Input from '../components/input';
import {
  Location,
  LocationWithMetadata,
  UserFavorites,
} from '../favorites/types';
import {useGeolocationState} from '../GeolocationContext';
import {RootStackParamList} from '../navigation';
import {useSearchHistory} from '../search-history';
import {StyleSheet} from '../theme';
import FavoriteChips, {ChipTypeGroup} from '../favorite-chips';
import LocationResults from './LocationResults';
import useDebounce from './useDebounce';
import {LocationSearchNavigationProp} from './';
import {TRONDHEIM_CENTRAL_STATION} from '../api/geocoder';
import {Close} from '../assets/svg/icons/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useGeocoder} from '../geocoder';
import MessageBox from '../message-box';
import {ErrorType} from '../api/utils';
import {useFavorites} from '../favorites';
import {LocationSearchResult} from './types';
import ThemeIcon from '../components/theme-icon';
import ThemeText from '../components/text';
import ScreenReaderAnnouncement from '../components/screen-reader-announcement';

export type Props = {
  navigation: LocationSearchNavigationProp;
  route: RouteProp<RootStackParamList, 'LocationSearch'>;
};

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  label: string;
  favoriteChipTypes?: ChipTypeGroup[];
  initialLocation?: LocationWithMetadata;
};

const LocationSearch: React.FC<Props> = ({
  navigation,
  route: {
    params: {
      callerRouteName,
      callerRouteParam,
      label,
      favoriteChipTypes,
      initialLocation,
    },
  },
}) => {
  const styles = useThemeStyles();
  const {history, addSearchEntry} = useSearchHistory();
  const {favorites} = useFavorites();

  const [text, setText] = useState<string>(initialLocation?.name ?? '');
  const debouncedText = useDebounce(text, 200);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const previousLocations = filterPreviousLocations(
    debouncedText,
    history,
    favorites,
  );

  const {location: geolocation} = useGeolocationState();

  const {locations, error} =
    useGeocoder(debouncedText, geolocation?.coords ?? null) ?? [];
  const filteredLocations = filterCurrentLocation(locations, previousLocations);

  const onSelect = (location: LocationWithMetadata) => {
    if (location.resultType === 'search') {
      addSearchEntry(location);
    }
    navigation.navigate(callerRouteName as any, {
      [callerRouteParam]: location,
    });
  };

  const onMapSelection = () => {
    const coordinates: {
      latitude: number;
      longitude: number;
      zoomLevel: number;
    } = initialLocation
      ? {...initialLocation.coordinates, zoomLevel: 12}
      : geolocation
      ? {...geolocation.coords, zoomLevel: 12}
      : {...TRONDHEIM_CENTRAL_STATION, zoomLevel: 6};

    navigation.navigate('MapSelection', {
      callerRouteName,
      callerRouteParam,
      coordinates: coordinates,
    });
  };

  const onSearchSelect = (searchResult: LocationSearchResult) => {
    if (!searchResult.favoriteInfo) {
      return onSelect({...searchResult.location, resultType: 'search'});
    }
    return onSelect({
      ...searchResult.location,
      resultType: 'favorite',
      favoriteId: searchResult.favoriteInfo.id,
    });
  };

  const inputRef = useRef<TextInput>(null);

  const isFocused = useIsFocused();

  // using setTimeout to counteract issue of other elements
  // capturing focus on mount and on press
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 0);

  useEffect(() => {
    if (isFocused) focusInput();
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      setErrorMessage(translateErrorType(error));
    }
  }, [error]);

  const onPrefillText = (text: string) => {
    setText(text);
    focusInput();
  };

  const hasPreviousResults = !!previousLocations.length;
  const hasResults = !!filteredLocations.length;
  const hasAnyResult = hasResults || hasPreviousResults;

  return (
    <SafeAreaView style={styles.container}>
      <View style={{paddingTop: 12, flex: 1}}>
        <View style={{marginHorizontal: 20}}>
          <Header
            leftButton={{
              onPress: () => navigation.goBack(),
              accessible: true,
              accessibilityRole: 'button',
              accessibilityLabel: 'Gå tilbake',
              icon: <ThemeIcon svg={Close} />,
            }}
            title="Søk"
          />
        </View>
        <ScreenReaderAnnouncement message={errorMessage} />

        <View style={[{marginTop: 12}, styles.contentBlock]}>
          <Input
            ref={inputRef}
            label={label}
            value={text}
            onChangeText={setText}
            showClear={Boolean(text?.length)}
            onClear={() => setText('')}
            placeholder="Søk etter adresse eller stoppested"
            autoCorrect={false}
            autoCompleteType="off"
          />
        </View>

        <View>
          <FavoriteChips
            onSelectLocation={onSelect}
            onMapSelection={onMapSelection}
            chipTypes={favoriteChipTypes}
            containerStyle={[styles.contentBlock, styles.chipBox]}
          />
        </View>

        {error && (
          <View style={styles.contentBlock}>
            <MessageBox
              type="warning"
              message={errorMessage}
              containerStyle={{marginBottom: 12}}
            />
          </View>
        )}

        {hasAnyResult ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentBlock}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={() => Keyboard.dismiss()}
          >
            {hasPreviousResults && (
              <LocationResults
                locations={previousLocations}
                onSelect={onSearchSelect}
                onPrefillText={onPrefillText}
              />
            )}
            {hasResults && (
              <LocationResults
                title="Søkeresultat"
                locations={filteredLocations}
                onSelect={onSearchSelect}
                onPrefillText={onPrefillText}
              />
            )}
          </ScrollView>
        ) : (
          !error &&
          !!text && (
            <View style={styles.contentBlock}>
              <MessageBox type="info">
                <ThemeText>Fant ingen søkeresultat</ThemeText>
              </MessageBox>
            </View>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

function translateErrorType(errorType: ErrorType): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return 'Hei, er du på nett? Vi kan ikke søke siden nettforbindelsen din mangler eller er ustabil.';
    default:
      return 'Oops - vi feila med søket. Supert om du prøver igjen 🤞';
  }
}

const filterPreviousLocations = (
  searchText: string,
  previousLocations: Location[],
  favorites?: UserFavorites,
): LocationSearchResult[] => {
  const mappedHistory: LocationSearchResult[] =
    previousLocations?.map((location) => ({
      location,
    })) ?? [];

  if (!searchText) {
    return mappedHistory;
  }

  const matchText = (text?: string) =>
    text?.toLowerCase()?.startsWith(searchText.toLowerCase());
  const filteredFavorites: LocationSearchResult[] = (favorites ?? [])
    .filter(
      (favorite) =>
        matchText(favorite.location?.name) || matchText(favorite.name),
    )
    .map(({location, ...favoriteInfo}) => ({
      location,
      favoriteInfo,
    }));

  return filteredFavorites.concat(
    mappedHistory.filter((l) => matchText(l.location.name)),
  );
};

const filterCurrentLocation = (
  locations: Location[] | null,
  previousLocations: LocationSearchResult[] | null,
): LocationSearchResult[] => {
  if (!previousLocations?.length || !locations)
    return locations?.map((location) => ({location})) ?? [];
  return locations
    .filter((l) => !previousLocations.some((pl) => pl.location.id === l.id))
    .map((location) => ({location}));
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
  },
  contentBlock: {
    paddingHorizontal: theme.spacings.medium,
  },
  scroll: {
    flex: 1,
  },
  chipBox: {
    marginBottom: theme.spacings.medium,
  },
}));

export default LocationSearch;
