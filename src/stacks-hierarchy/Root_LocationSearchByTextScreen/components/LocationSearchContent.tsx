import {
  useSearchHistoryContext,
  JourneySearchHistoryEntry,
} from '@atb/modules/search-history';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {useDebounce} from '@atb/utils/use-debounce';
import {filterPreviousLocations} from '../utils';
import {useGeolocationContext} from '@atb/modules/geolocation';
import {LocationSearchResultType, SelectableLocationType} from '../types';
import {useAccessibilityContext} from '@atb/modules/accessibility';
import {ActivityIndicator, Keyboard, View} from 'react-native';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {Section, TextInputSectionItem} from '@atb/components/sections';
import {
  FavoriteChips,
  ChipTypeGroup,
  useFavoritesContext,
} from '@atb/modules/favorites';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ScrollView} from 'react-native-gesture-handler';
import {JourneyHistory} from './JourneyHistory';
import {LocationResults} from './LocationResults';
import {StyleSheet, Theme, useThemeContext} from '@atb/theme';
import {translateErrorType} from '@atb/stacks-hierarchy/utils';
import {animateNextChange} from '@atb/utils/animation';
import {CheckboxWithLabel} from '@atb/components/checkbox';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {storage} from '@atb/modules/storage';
import {usePersistedBoolState} from '@atb/utils/use-persisted-bool-state';
import {useGeocoderQuery} from '@atb/modules/geocoder';
import {RequestError, toAxiosErrorKind} from '@atb/api/utils';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type LocationSearchContentProps = {
  label: string;
  placeholder: string;
  favoriteChipTypes?: ChipTypeGroup[];
  defaultText?: string;
  onSelect(location: SelectableLocationType): void;
  onMapSelection?(): void;
  onlyLocalFareZoneAuthority?: boolean;
  includeHistory?: boolean;
  includeJourneyHistory?: boolean;
  onlyStopPlacesCheckboxInitialState: boolean;
  onAddFavoritePlace: () => void;
};

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];

export function LocationSearchContent({
  label,
  placeholder,
  favoriteChipTypes,
  defaultText,
  onSelect,
  onMapSelection,
  onlyLocalFareZoneAuthority = false,
  includeHistory = true,
  includeJourneyHistory = false,
  onlyStopPlacesCheckboxInitialState,
  onAddFavoritePlace,
}: LocationSearchContentProps) {
  const styles = useThemeStyles();
  const {favorites} = useFavoritesContext();
  const {history, addSearchEntry} = useSearchHistoryContext();
  const {t} = useTranslation();
  const analytics = useAnalyticsContext();
  const {theme} = useThemeContext();
  const {bottom} = useSafeAreaInsets();

  const [text, setText] = useState<string>(defaultText ?? '');
  const debouncedText = useDebounce(text, 200);

  const previousLocations = filterPreviousLocations(
    debouncedText,
    history,
    favorites,
    onlyLocalFareZoneAuthority,
  );

  const {isOnlyStopPlacesCheckboxEnabled} = useFeatureTogglesContext();
  const [onlyStopPlaces, setOnlyStopPlaces] = usePersistedBoolState(
    storage,
    '@ATB_only_stop_places_checkbox',
    onlyStopPlacesCheckboxInitialState,
  );

  const {location: geolocation} = useGeolocationContext();

  const {
    data: locations,
    error: queryError,
    isLoading,
  } = useGeocoderQuery(
    debouncedText,
    geolocation?.coordinates ?? null,
    onlyLocalFareZoneAuthority,
    onlyStopPlaces,
  );
  const error = queryError as RequestError | null;

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

  const errorMessage = error
    ? translateErrorType(toAxiosErrorKind(error.kind), t)
    : undefined;

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
            onAddFavoritePlace={onAddFavoritePlace}
            backgroundColor={theme.color.background.neutral[2]}
          />
        )}
        {isOnlyStopPlacesCheckboxEnabled && (
          <CheckboxWithLabel
            label={t(LocationSearchTexts.onlyStopPlacesCheckbox)}
            checked={onlyStopPlaces}
            onPress={(v) => {
              analytics.logEvent(
                'Location search',
                'Only stop places checkbox pressed',
                {checked: v},
              );
              setOnlyStopPlaces(v);
            }}
            color={getThemeColor(theme)}
            style={styles.onlyStopPlacesCheckbox}
          />
        )}
      </View>
      {errorMessage && (
        <View style={styles.withMargin}>
          <MessageInfoBox type="warning" message={errorMessage} />
        </View>
      )}
      <ScrollView
        style={{...styles.fullFlex}}
        contentContainerStyle={[styles.contentBlock, {paddingBottom: bottom}]}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={() => Keyboard.dismiss()}
        testID="historyAndResultsScrollView"
      >
        {isLoading && <ActivityIndicator />}
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
              !!text &&
              locations?.length === 0 && (
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
    backgroundColor: getThemeColor(theme).background,
    paddingBottom: theme.spacing.medium,
  },
  withMargin: {
    margin: theme.spacing.medium,
  },
  chipBox: {
    marginTop: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  onlyStopPlacesCheckbox: {
    marginTop: theme.spacing.medium,
    paddingHorizontal: theme.spacing.medium,
  },
  contentBlock: {
    marginHorizontal: theme.spacing.medium,
  },
  marginTop: {
    marginTop: theme.spacing.medium,
  },
  fullFlex: {
    backgroundColor: theme.color.background.neutral[2].background,
    flex: 1,
  },
}));
