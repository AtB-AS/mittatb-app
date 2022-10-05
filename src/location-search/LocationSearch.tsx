import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {JourneySearchHistoryEntry} from '@atb/search-history/types';
import React, {useEffect, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {ErrorType} from '../api/utils';
import MessageBox from '../components/message-box';
import FullScreenHeader from '../components/screen-header/full-header';
import ScreenReaderAnnouncement from '../components/screen-reader-announcement';
import {TextInput} from '../components/sections';
import FavoriteChips, {ChipTypeGroup} from '../favorite-chips';
import {useFavorites} from '../favorites';
import {Location} from '../favorites/types';
import {useGeocoder} from '../geocoder';
import {useGeolocationState} from '../GeolocationContext';
import {useSearchHistory} from '../search-history';
import {StyleSheet} from '../theme';
import {
  LocationSearchTexts,
  TranslateFunction,
  useTranslation,
} from '../translations/';
import JourneyHistory from './JourneyHistory';
import LocationResults from './LocationResults';
import {
  LocationSearchResult,
  LocationSearchScreenProps,
  SelectableLocationData,
} from './types';
import useDebounce from './useDebounce';
import {filterCurrentLocation, filterPreviousLocations} from './utils';

export type Props = LocationSearchScreenProps<'LocationSearchMain'>;

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  label: string;
  favoriteChipTypes?: ChipTypeGroup[];
  initialLocation?: Location;
  includeJourneyHistory?: boolean;
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
      includeJourneyHistory = false,
    },
  },
}) => {
  const {t} = useTranslation();
  const styles = useThemeStyles();

  const onSelect = (location: SelectableLocationData) => {
    navigation.navigate({
      name: callerRouteName as any,
      params: {
        [callerRouteParam]: location,
      },
      merge: true,
    });
  };

  const onMapSelection = () => {
    navigation.navigate({
      name: 'MapSelection',
      params: {
        callerRouteName,
        callerRouteParam,
        initialLocation,
      },
      merge: true,
    });
  };

  const a11yContext = useAccessibilityContext();

  return (
    <View style={styles.container}>
      <FullScreenHeader
        title={t(LocationSearchTexts.header.title)}
        leftButton={{type: 'close'}}
        setFocusOnLoad={a11yContext.isScreenReaderEnabled}
      />

      <LocationSearchContent
        onSelect={onSelect}
        onMapSelection={onMapSelection}
        label={label}
        favoriteChipTypes={favoriteChipTypes}
        placeholder={t(LocationSearchTexts.searchField.placeholder)}
        defaultText={
          initialLocation?.resultType === 'search'
            ? initialLocation.name
            : undefined
        }
        includeJourneyHistory={includeJourneyHistory}
      />
    </View>
  );
};

type LocationSearchContentProps = {
  label: string;
  placeholder: string;
  favoriteChipTypes?: ChipTypeGroup[];
  defaultText?: string;
  onSelect(location: SelectableLocationData): void;
  onMapSelection?(): void;
  onlyLocalTariffZoneAuthority?: boolean;
  includeHistory?: boolean;
  includeJourneyHistory?: boolean;
};

export function LocationSearchContent({
  label,
  placeholder,
  favoriteChipTypes,
  defaultText,
  onSelect,
  onMapSelection,
  onlyLocalTariffZoneAuthority = false,
  includeHistory = true,
  includeJourneyHistory = false,
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
    onlyLocalTariffZoneAuthority,
  );

  const {location: geolocation} = useGeolocationState();

  const {locations, error} = useGeocoder(
    debouncedText,
    geolocation?.coordinates ?? null,
    onlyLocalTariffZoneAuthority,
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
  const onJourneyHistorySelected = (journeyData: JourneySearchHistoryEntry) => {
    return onSelect({
      resultType: 'journey',
      journeyData,
    });
  };

  const a11yContext = useAccessibilityContext();

  useEffect(() => {
    if (error) {
      setErrorMessage(translateErrorType(error, t));
    }
  }, [error]);

  const hasPreviousResults = !!previousLocations.length;
  const hasResults = !!filteredLocations.length;
  const hasAnyResult = hasResults || (includeHistory && hasPreviousResults);

  return (
    <>
      <View style={styles.header}>
        <ScreenReaderAnnouncement message={errorMessage} />

        <View style={styles.withMargin}>
          <TextInput
            radius="top-bottom"
            label={label}
            value={text}
            onChangeText={setText}
            showClear={Boolean(text?.length)}
            onClear={() => setText('')}
            placeholder={placeholder}
            autoCorrect={false}
            autoComplete="off"
            autoFocus={!a11yContext.isScreenReaderEnabled}
            testID="locationSearchInput"
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
          testID="historyAndResultsScrollView"
        >
          {includeJourneyHistory && (
            <JourneyHistory
              searchText={debouncedText}
              onSelect={onJourneyHistorySelected}
            />
          )}
          {includeHistory && hasPreviousResults && (
            <LocationResults
              title={t(LocationSearchTexts.results.previousResults.heading)}
              locations={previousLocations}
              onSelect={onSearchSelect}
              testIDItemPrefix="previousResultItem"
            />
          )}
          {hasResults && (
            <LocationResults
              title={t(LocationSearchTexts.results.searchResults.heading)}
              locations={filteredLocations}
              onSelect={onSearchSelect}
              testIDItemPrefix="locationSearchItem"
            />
          )}
        </ScrollView>
      ) : (
        !error &&
        !!text && (
          <View style={[styles.contentBlock, styles.marginTop]}>
            <MessageBox
              type="info"
              message={t(LocationSearchTexts.messages.emptyResult)}
            />
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

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.static.background.background_2.background,
    flex: 1,
  },
  header: {
    backgroundColor: theme.static.background.background_accent_0.background,
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
