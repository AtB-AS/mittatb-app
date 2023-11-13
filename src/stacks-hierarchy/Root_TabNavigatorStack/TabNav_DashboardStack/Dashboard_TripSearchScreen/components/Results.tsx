import {ErrorType} from '@atb/api/utils';
import {DayLabel} from './DayLabel';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {MessageBox} from '@atb/components/message-box';

import {StyleSheet} from '@atb/theme';
import {
  TranslateFunction,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';

import React, {Fragment, useEffect, useState} from 'react';
import {View} from 'react-native';

import {SearchTime} from '@atb/journey-date-picker';
import {MemoizedResultItem} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/ResultItem';
import {TripPattern} from '@atb/api/types/trips';
import {TripPatternWithKey} from '@atb/travel-details-screens/types';
import {getIsTooLateToBookTripPattern} from '@atb/travel-details-screens/utils';
import {useNow} from '@atb/utils/use-now';

import {EmptyState} from '@atb/components/empty-state';
import {ThemedOnBehalfOf} from '@atb/theme/ThemedAssets';

type Props = {
  tripPatterns: TripPatternWithKey[];
  showEmptyScreen: boolean;
  isEmptyResult: boolean;
  isSearching: boolean;
  resultReasons: string[];
  onDetailsPressed(tripPattern: TripPattern, resultIndex?: number): void;
  errorType?: ErrorType;
  searchTime: SearchTime;
  anyFiltersApplied: boolean;
};

export const Results: React.FC<Props> = ({
  tripPatterns,
  showEmptyScreen,
  isEmptyResult,
  resultReasons,
  onDetailsPressed,
  errorType,
  searchTime,
  anyFiltersApplied,
}) => {
  const styles = useThemeStyles();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const {t} = useTranslation();

  const now = useNow(30000);

  useEffect(() => {
    if (errorType) {
      switch (errorType) {
        case 'network-error':
        case 'timeout':
          setErrorMessage(t(TripSearchTexts.results.error.network));
          break;
        default:
          setErrorMessage(t(TripSearchTexts.results.error.generic));
          break;
      }
    }
  }, [errorType, t]);

  if (showEmptyScreen) {
    return null;
  }

  if (errorType) {
    return (
      <View style={styles.errorContainer}>
        <ScreenReaderAnnouncement message={errorMessage} />
        <MessageBox
          type="warning"
          message={errorMessage}
          style={styles.messageBoxContainer}
        />
      </View>
    );
  }

  if (isEmptyResult) {
    return (
      <View style={styles.emptyStateContainer}>
        <EmptyState
          title={t(TripSearchTexts.results.info.emptySearchResultsTitle)}
          details={getDetailsTextForEmptyResult(
            resultReasons,
            anyFiltersApplied,
            t,
          )}
          illustrationComponent={
            <ThemedOnBehalfOf
              height={90}
              style={styles.emptySearchResultsIllustration}
            />
          }
          testID="searchResults"
        />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="tripSearchContentView">
      {tripPatterns
        .filter((tp) => !getIsTooLateToBookTripPattern(tp, now))
        .map((tripPattern, i) => (
          <Fragment key={tripPattern.key}>
            <DayLabel
              departureTime={tripPattern.expectedStartTime}
              previousDepartureTime={tripPatterns[i - 1]?.expectedStartTime}
            />
            <MemoizedResultItem
              tripPattern={tripPattern}
              onDetailsPressed={onDetailsPressed}
              resultIndex={i}
              searchTime={searchTime}
              testID={'tripSearchSearchResult' + i}
            />
          </Fragment>
        ))}
    </View>
  );
};

const getDetailsTextForEmptyResult = (
  resultReasons: string[],
  anyFiltersApplied: boolean,
  t: TranslateFunction,
) => {
  let text = '';
  if (!resultReasons?.length) {
    text += anyFiltersApplied
      ? t(TripSearchTexts.results.info.emptySearchResultsDetailsWithFilters)
      : t(TripSearchTexts.results.info.emptySearchResultsDetails);
  } else if (resultReasons.length === 1) {
    text += resultReasons[0];
  } else {
    text += t(TripSearchTexts.results.info.reasonsTitle);
    resultReasons.forEach((reason) => (text += `\n- ${reason}`));
  }
  return text;
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
  errorContainer: {
    paddingBottom: theme.spacings.medium,
  },
  infoBoxText: theme.typography.body__primary,
  messageBoxContainer: {
    marginHorizontal: theme.spacings.medium,
    marginTop: theme.spacings.medium,
  },
  emptyStateContainer: {
    marginTop: theme.spacings.medium,
  },
  emptySearchResultsIllustration: {
    marginBottom: theme.spacings.medium,
  },
}));
