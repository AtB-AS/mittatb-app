import {GenericItem, HeaderItem} from '@atb/components/sections';
import SectionGroup from '@atb/components/sections/section';
import {JourneySearchHistoryEntry} from '@atb/search-history/types';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {screenReaderPause} from '../components/accessible-text';
import ThemeText from '../components/text';
import {useFilteredJourneySearch} from './utils';

type JourneyHistoryProps = {
  searchText?: string;
  onSelect: (journey: JourneySearchHistoryEntry) => void;
};

// @TODO Could be configurable at some point.
const DEFAULT_HISTORY_LIMIT = 3;

export default function JourneyHistory({
  searchText,
  onSelect,
}: JourneyHistoryProps) {
  const {t} = useTranslation();
  const journeyHistory = useFilteredJourneySearch(searchText);

  if (!journeyHistory.length) {
    return null;
  }

  return (
    <SectionGroup withTopPadding withBottomPadding>
      <HeaderItem
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
          .map((searchResult) => (
            <TouchableOpacity
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
            >
              <GenericItem transparent>
                <ThemeText type="paragraphHeadline">
                  {searchResult.text}
                </ThemeText>
              </GenericItem>
            </TouchableOpacity>
          ))}
      </View>
    </SectionGroup>
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
