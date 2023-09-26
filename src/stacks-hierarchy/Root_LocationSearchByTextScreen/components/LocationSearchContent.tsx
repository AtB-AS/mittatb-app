import {useSearchHistory, JourneySearchHistoryEntry} from '@atb/search-history';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {useDebounce} from '@atb/utils/useDebounce';
import {filterCurrentLocation, filterPreviousLocations} from '../utils';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useGeocoder} from '@atb/geocoder';
import {LocationSearchResultType, SelectableLocationType} from '../types';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {Keyboard, ScrollView, View} from 'react-native';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {TextInputSectionItem} from '@atb/components/sections';
import {FavoriteChips, ChipTypeGroup, useFavorites} from '@atb/favorites';
import {MessageBox} from '@atb/components/message-box';
import {JourneyHistory} from './JourneyHistory';
import {LocationResults} from './LocationResults';
import {StyleSheet} from '@atb/theme';
import {translateErrorType} from '@atb/stacks-hierarchy/utils';
import {animateNextChange} from '@atb/utils/animation';

type LocationSearchContentProps = {
  label: string;
  placeholder: string;
  favoriteChipTypes?: ChipTypeGroup[];
  defaultText?: string;
  onSelect(location: SelectableLocationType): void;
  onMapSelection?(): void;
  onlyLocalTariffZoneAuthority?: boolean;
  includeHistory?: boolean;
  includeJourneyHistory?: boolean;
  onAddFavorite: () => void;
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
  onAddFavorite,
}: LocationSearchContentProps) {
  const styles = useThemeStyles();
  const {favorites} = useFavorites();
  const {history, addSearchEntry} = useSearchHistory();
  const {t} = useTranslation();

  const [text, setText] = useState<string>(defaultText ?? '');
  const delay = text.length == 1 ? 0 : 150; //for first typing, do search immediately
  const debouncedText = useDebounce(text, delay);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const previousLocations = filterPreviousLocations(
    debouncedText,
    history,
    favorites,
    onlyLocalTariffZoneAuthority,
  );

  const {location: geolocation} = useGeolocationState();

  const {locations, error, isSearching} = useGeocoder(
    debouncedText,
    geolocation?.coordinates ?? null,
    onlyLocalTariffZoneAuthority,
  );

  const filteredLocations = filterCurrentLocation(
    locations,
    includeHistory ? previousLocations : [],
  );

  const onSearchSelect = (searchResult: LocationSearchResultType) => {
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
  const hasResults = !!filteredLocations.length && filteredLocations.length > 0;
  const searchBarIsEmpty = text === '' || text.length === 0;

  const [showMessageBox, setShowMessageBox] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (!isSearching && !!text && filteredLocations.length === 0) {
      // If not searching, text is present, and no results, then plan to show the MessageBox after a delay
      timeoutId = setTimeout(() => setShowMessageBox(true), 300);
    } else if (filteredLocations.length > 0 || text.length === 0) {
      // If there are results or the search string is empty, then immediately hide the MessageBox
      setShowMessageBox(false);
    }
    return () => timeoutId && clearTimeout(timeoutId);
  }, [isSearching, text, filteredLocations]);

  return (
    <>
      <View style={styles.header}>
        <ScreenReaderAnnouncement message={errorMessage} />

        <View style={styles.contentBlock}>
          <TextInputSectionItem
            radius="top-bottom"
            label={label}
            value={text}
            onChangeText={(newText) => {
              if (searchBarIsEmpty || newText.length === 0) {
                animateNextChange();
              }
              setText(newText);
            }}
            showClear={Boolean(text?.length)}
            onClear={() => {
              animateNextChange();
              setText('');
            }}
            placeholder={placeholder}
            autoCorrect={false}
            autoComplete="off"
            autoFocus={!a11yContext.isScreenReaderEnabled}
            testID="locationSearchInput"
          />

          {searchBarIsEmpty && (
            <FavoriteChips
              onSelectLocation={onSelect}
              onMapSelection={onMapSelection}
              chipTypes={favoriteChipTypes}
              style={styles.chipBox}
              onAddFavorite={onAddFavorite}
            />
          )}
        </View>
      </View>
      {error && (
        <View style={styles.withMargin}>
          <MessageBox type="warning" message={errorMessage} />
        </View>
      )}
      <ScrollView
        style={{...styles.fullFlex}}
        contentContainerStyle={styles.contentBlock}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
        testID="historyAndResultsScrollView"
      >
        {searchBarIsEmpty ? (
          <>
            {includeJourneyHistory && (
              <JourneyHistory
                searchText={''}
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
          </>
        ) : (
          hasResults && (
            <LocationResults
              title={t(LocationSearchTexts.results.searchResults.heading)}
              locations={filteredLocations}
              onSelect={onSearchSelect}
              testIDItemPrefix="locationSearchItem"
            />
          )
        )}
        {showMessageBox && (
          <View style={[styles.contentBlock, styles.marginTop]}>
            <MessageBox
              type="info"
              message={t(LocationSearchTexts.messages.emptyResult)}
            />
          </View>
        )}
      </ScrollView>
    </>
  );
}

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.static.background.background_accent_0.background,
    paddingBottom: theme.spacings.medium,
  },
  withMargin: {
    margin: theme.spacings.medium,
  },
  chipBox: {
    marginTop: theme.spacings.medium,
  },
  contentBlock: {
    paddingHorizontal: theme.spacings.medium,
  },
  marginTop: {
    marginTop: theme.spacings.medium,
  },
  fullFlex: {
    flex: 1,
    backgroundColor: theme.static.background.background_2.background,
  },
}));
