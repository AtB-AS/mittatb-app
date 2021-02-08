import {RouteProp, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, TextInput as InternalTextInput, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {TRONDHEIM_CENTRAL_STATION} from '../api/geocoder';
import {ErrorType} from '../api/utils';
import ScreenReaderAnnouncement from '../components/screen-reader-announcement';
import {TextInput} from '../components/sections';
import ThemeText from '../components/text';
import FavoriteChips, {ChipTypeGroup} from '../favorite-chips';
import {useFavorites} from '../favorites';
import {
  Location,
  LocationWithMetadata,
  UserFavorites,
} from '../favorites/types';
import {useGeocoder} from '../geocoder';
import {useGeolocationState} from '../GeolocationContext';
import MessageBox from '../message-box';
import {RootStackParamList} from '../navigation';
import FullScreenHeader from '../ScreenHeader/full-header';
import {useSearchHistory} from '../search-history';
import {StyleSheet} from '../theme';
import {
  LocationSearchTexts,
  TranslateFunction,
  useTranslation,
} from '../translations/';
import {LocationSearchNavigationProp} from './';
import LocationResults from './LocationResults';
import {LocationSearchResult} from './types';
import useDebounce from './useDebounce';
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
  const {t} = useTranslation();
  const styles = useThemeStyles();
  const {location: geolocation} = useGeolocationState();

  const onSelect = (location: LocationWithMetadata) => {
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

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(LocationSearchTexts.header.title)}
        leftButton={{type: 'close'}}
      />

      <LocationSearchContent
        onSelect={onSelect}
        onMapSelection={onMapSelection}
        label={label}
        favoriteChipTypes={favoriteChipTypes}
        placeholder={t(LocationSearchTexts.searchField.placeholder)}
        defaultText={initialLocation?.name}
      />
    </View>
  );
};

type LocationSearchContentProps = {
  label: string;
  placeholder: string;
  favoriteChipTypes?: ChipTypeGroup[];
  defaultText?: string;
  onSelect(location: LocationWithMetadata): void;
  onMapSelection?(): void;
  onlyAtbVenues?: boolean;
  includeHistory?: boolean;
};

export function LocationSearchContent({
  label,
  placeholder,
  favoriteChipTypes,
  defaultText,
  onSelect,
  onMapSelection,
  onlyAtbVenues = false,
  includeHistory = true,
}: LocationSearchContentProps) {
  const styles = useThemeStyles();
  const {favorites} = useFavorites();
  const {history, addSearchEntry} = useSearchHistory();
  const {t} = useTranslation();

  const [text, setText] = useState<string>(defaultText ?? '');
  const debouncedText = useDebounce(text, 200);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const previousLocations = filterPreviousLocations(
    debouncedText,
    history,
    favorites,
    onlyAtbVenues,
  );

  const {location: geolocation} = useGeolocationState();

  const {locations, error} = useGeocoder(
    debouncedText,
    geolocation?.coords ?? null,
    onlyAtbVenues,
  );

  const filteredLocations = filterCurrentLocation(
    locations,
    includeHistory ? previousLocations : [],
  );

  const onSearchSelect = (searchResult: LocationSearchResult) => {
    if (!searchResult.favoriteInfo) {
      addSearchEntry(searchResult.location);
    }

    if (!searchResult.favoriteInfo) {
      return onSelect({...searchResult.location, resultType: 'search'});
    }
    return onSelect({
      ...searchResult.location,
      resultType: 'favorite',
      favoriteId: searchResult.favoriteInfo.id,
    });
  };

  const inputRef = useRef<InternalTextInput>(null);

  const isFocused = useIsFocused();

  // using setTimeout to counteract issue of other elements
  // capturing focus on mount and on press
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 0);

  useEffect(() => {
    if (isFocused) focusInput();
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      setErrorMessage(translateErrorType(error, t));
    }
  }, [error]);

  const onPrefillText = (text: string) => {
    setText(text);
    focusInput();
  };

  const hasPreviousResults = !!previousLocations.length;
  const hasResults = !!filteredLocations.length;
  const hasAnyResult = hasResults || (includeHistory && hasPreviousResults);

  return (
    <>
      <View style={styles.header}>
        <ScreenReaderAnnouncement message={errorMessage} />

        <View style={styles.withMargin}>
          <TextInput
            ref={inputRef}
            radius="top-bottom"
            label={label}
            value={text}
            onChangeText={setText}
            showClear={Boolean(text?.length)}
            onClear={() => setText('')}
            placeholder={placeholder}
            autoCorrect={false}
            autoCompleteType="off"
          />
        </View>

        <View>
          <FavoriteChips
            onSelectLocation={onSelect}
            onMapSelection={onMapSelection}
            chipTypes={favoriteChipTypes}
            containerStyle={styles.chipBox}
            contentContainerStyle={styles.contentBlock}
          />
        </View>
      </View>

      {error && (
        <View style={styles.withMargin}>
          <MessageBox type="warning" message={errorMessage} />
        </View>
      )}

      {hasAnyResult ? (
        <ScrollView
          style={styles.fullFlex}
          contentContainerStyle={styles.contentBlock}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
        >
          {includeHistory && hasPreviousResults && (
            <LocationResults
              title={t(LocationSearchTexts.results.previousResults.heading)}
              locations={previousLocations}
              onSelect={onSearchSelect}
              onPrefillText={onPrefillText}
            />
          )}
          {hasResults && (
            <LocationResults
              title={t(LocationSearchTexts.results.searchResults.heading)}
              locations={filteredLocations}
              onSelect={onSearchSelect}
              onPrefillText={onPrefillText}
            />
          )}
        </ScrollView>
      ) : (
        !error &&
        !!text && (
          <View style={[styles.contentBlock, styles.marginTop]}>
            <MessageBox type="info">
              <ThemeText>
                {t(LocationSearchTexts.messages.emptyResult)}
              </ThemeText>
            </MessageBox>
          </View>
        )
      )}
    </>
  );
}

function translateErrorType(
  errorType: ErrorType,
  t: TranslateFunction,
): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return t(LocationSearchTexts.messages.networkError);
    default:
      return t(LocationSearchTexts.messages.defaultError);
  }
}

const filterPreviousLocations = (
  searchText: string,
  previousLocations: Location[],
  favorites?: UserFavorites,
  onlyAtbVenues: boolean = false,
): LocationSearchResult[] => {
  const mappedHistory: LocationSearchResult[] =
    previousLocations
      ?.map((location) => ({
        location,
      }))
      .filter(
        (location) => !onlyAtbVenues || location.location.layer == 'venue',
      ) ?? [];

  if (!searchText) {
    return mappedHistory;
  }

  const matchText = (text?: string) =>
    text?.toLowerCase()?.startsWith(searchText.toLowerCase());
  const filteredFavorites: LocationSearchResult[] = (favorites ?? [])
    .filter(
      (favorite) =>
        (matchText(favorite.location?.name) || matchText(favorite.name)) &&
        (!onlyAtbVenues || favorite.location.layer == 'venue'),
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
  header: {
    backgroundColor: theme.background.header,
  },
  withMargin: {
    margin: theme.spacings.medium,
  },
  chipBox: {
    marginBottom: theme.spacings.medium,
  },
  contentBlock: {
    paddingHorizontal: theme.spacings.medium,
  },
  marginTop: {
    marginTop: theme.spacings.medium,
  },
  fullFlex: {
    flex: 1,
  },
}));

export default LocationSearch;
