import {useSearchHistory, JourneySearchHistoryEntry} from '@atb/search-history';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import React, {useEffect, useState} from 'react';
import {useDebounce} from '@atb/utils/use-debounce';
import {filterPreviousLocations} from '../utils';
import {useGeolocationState} from '@atb/GeolocationContext';
import {useGeocoder} from '@atb/geocoder';
import {LocationSearchResultType, SelectableLocationType} from '../types';
import {useAccessibilityContext} from '@atb/AccessibilityContext';
import {Keyboard, View} from 'react-native';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {FavoriteChips, ChipTypeGroup, useFavorites} from '@atb/favorites';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ScrollView} from 'react-native-gesture-handler';
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
  const debouncedText = useDebounce(text, 200);

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

  const locationSearchResults: LocationSearchResultType[] =
    locations?.map((location) => ({location})) ?? [];

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
  }, [error, t]);

  const hasPreviousResults = !!previousLocations.length;
  const hasResults = !!locationSearchResults.length;
  const searchBarIsEmpty = text === '' || text.length === 0;

  return (
    <>
      <View style={styles.header}>
        <ScreenReaderAnnouncement message={errorMessage} />
        <Section style={styles.contentBlock}>
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
        </Section>

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
      {error && (
        <View style={styles.withMargin}>
          <MessageInfoBox type="warning" message={errorMessage} />
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
                searchText=""
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
          <>
            {hasResults ? (
              <LocationResults
                title={t(LocationSearchTexts.results.searchResults.heading)}
                locations={locationSearchResults}
                onSelect={onSearchSelect}
                testIDItemPrefix="locationSearchItem"
              />
            ) : (
              !error &&
              !!text &&
              locations != null &&
              !isSearching && (
                <View style={[styles.contentBlock, styles.marginTop]}>
                  <MessageInfoBox
                    type="info"
                    message={t(LocationSearchTexts.messages.emptyResult)}
                  />
                </View>
              )
            )}
          </>
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
    paddingHorizontal: theme.spacings.medium,
  },
  contentBlock: {
    marginHorizontal: theme.spacings.medium,
  },
  marginTop: {
    marginTop: theme.spacings.medium,
  },
  fullFlex: {
    backgroundColor: theme.static.background.background_2.background,
    flex: 1,
  },
}));
