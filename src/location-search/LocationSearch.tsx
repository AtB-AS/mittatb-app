import {RouteProp, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, TextInput as InternalTextInput, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {TRONDHEIM_CENTRAL_STATION} from '../api/geocoder';
import {ErrorType} from '../api/utils';
import {Close} from '../assets/svg/icons/actions';
import ScreenReaderAnnouncement from '../components/screen-reader-announcement';
import {TextInput} from '../components/sections';
import ThemeText from '../components/text';
import ThemeIcon from '../components/theme-icon';
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
import {LocationSearchNavigationProp} from './';
import LocationResults from './LocationResults';
import {LocationSearchResult} from './types';
import useDebounce from './useDebounce';
import {useTranslation} from '../utils/language';
import {LocationSearchTexts} from '../translations';
import {TranslateFunction} from '../translations/utils';
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
  const styles = useThemeStyles();
  const {history, addSearchEntry} = useSearchHistory();
  const {favorites} = useFavorites();

  const [text, setText] = useState<string>(initialLocation?.name ?? '');
  const debouncedText = useDebounce(text, 200);
  const {t} = useTranslation();

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
  const hasAnyResult = hasResults || hasPreviousResults;

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(LocationSearchTexts.header.title)}
        leftButton={{
          onPress: () => navigation.goBack(),
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: t(
            LocationSearchTexts.header.leftButton.a11yLabel,
          ),
          icon: <ThemeIcon svg={Close} />,
        }}
      />

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
            placeholder={t(LocationSearchTexts.searchField.placeholder)}
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
          style={styles.scroll}
          contentContainerStyle={styles.contentBlock}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={() => Keyboard.dismiss()}
        >
          {hasPreviousResults && (
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
          <View style={styles.contentBlock}>
            <MessageBox type="info">
              <ThemeText>
                {t(LocationSearchTexts.messages.emptyResult)}
              </ThemeText>
            </MessageBox>
          </View>
        )
      )}
    </View>
  );
};

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
  scroll: {
    flex: 1,
  },
}));

export default LocationSearch;
