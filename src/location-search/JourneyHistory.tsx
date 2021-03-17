import {GenericItem, HeaderItem} from '@atb/components/sections';
import SectionGroup from '@atb/components/sections/section';
import {useSearchHistory} from '@atb/search-history';
import {JourneySearchHistoryEntry} from '@atb/search-history/types';
import {LocationSearchTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {screenReaderPause} from '../components/accessible-text';
import ThemeText from '../components/text';
import insets from '../utils/insets';

type JourneyHistoryProps = {
  onSelect: (journey: JourneySearchHistoryEntry) => void;
};

export default function JourneyHistory({onSelect}: JourneyHistoryProps) {
  const {t} = useTranslation();
  const {journeyHistory} = useSearchHistory();

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
        {journeyHistory.map(mapToVisibleSearchResult).map((searchResult) => (
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={searchResult.text + screenReaderPause}
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
    text: `${from.name} - ${to.name}`,
  };
}
