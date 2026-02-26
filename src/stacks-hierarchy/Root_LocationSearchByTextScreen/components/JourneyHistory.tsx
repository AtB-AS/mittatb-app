import {GenericSectionItem, HeaderSectionItem} from '@atb/components/sections';
import {JourneySearchHistoryEntry} from '@atb/modules/search-history';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {useFilteredJourneySearch} from '../utils';
import {NativeButton} from '@atb/components/native-button';
import {StyleSheet} from '@atb/theme';

type JourneyHistoryProps = {
  searchText?: string;
  onSelect: (journey: JourneySearchHistoryEntry) => void;
};

// @TODO Could be configurable at some point.
const DEFAULT_HISTORY_LIMIT = 3;

export function JourneyHistory({searchText, onSelect}: JourneyHistoryProps) {
  const {t} = useTranslation();
  const styles = useStyles();
  const journeyHistory = useFilteredJourneySearch(searchText);

  if (!journeyHistory.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      <HeaderSectionItem
        transparent
        text={t(
          LocationSearchTexts.journeySearch.previousJourneyResults.heading,
        )}
        mode="subheading"
      />
      <View>
        {journeyHistory
          .slice(0, DEFAULT_HISTORY_LIMIT)
          .map(mapToVisibleSearchResult)
          .map((searchResult, idx) => (
            <NativeButton
              accessible={true}
              key={searchResult.key}
              accessibilityLabel={
                t(
                  LocationSearchTexts.journeySearch.result.a11yLabel(
                    searchResult.fromName,
                    searchResult.toName,
                  ),
                ) + screenReaderPause
              }
              accessibilityHint={t(
                LocationSearchTexts.journeySearch.result.a11yHint,
              )}
              accessibilityRole="button"
              onPress={() => onSelect(searchResult.selectable)}
              testID={'journeyHistoryItem' + idx}
            >
              <GenericSectionItem transparent>
                <ThemeText typography="body__m__strong">
                  {searchResult.text}
                </ThemeText>
              </GenericSectionItem>
            </NativeButton>
          ))}
      </View>
    </View>
  );
}

function mapToVisibleSearchResult(entry: JourneySearchHistoryEntry) {
  const [from, to] = entry;
  return {
    key: `${from.id}-${to.id}`,
    selectable: entry,
    fromName: from.name,
    toName: to.name,
    text: `${from.name} - ${to.name}`,
  };
}

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingTop: theme.spacing.medium,
  },
}));
