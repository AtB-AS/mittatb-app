import {AxiosErrorKind} from '@atb/api/utils';
import {DayLabel} from './DayLabel';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {MessageInfoBox} from '@atb/components/message-info-box';

import {StyleSheet} from '@atb/theme';
import {
  TranslateFunction,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';

import React, {Fragment, useEffect, useState} from 'react';
import {View} from 'react-native';

import {TripPattern} from '@atb/api/types/trips';
import {TripPatternWithKey} from '@atb/screen-components/travel-details-screens';
import {getIsTooLateToBookFlexLine} from '@atb/screen-components/travel-details-screens';
import {useNow} from '@atb/utils/use-now';

import {EmptyState} from '@atb/components/empty-state';
import {ThemedOnBehalfOf} from '@atb/theme/ThemedAssets';
import type {TripSearchTime} from '../../types';
import {ResultRow} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/ResultRow';
import {SaveableTripSearchResultRow} from '@atb/modules/experimental-store-trip-patterns';

type Props = {
  tripPatterns: TripPatternWithKey[];
  showEmptyScreen: boolean;
  isEmptyResult: boolean;
  isSearching: boolean;
  resultReasons: string[];
  onDetailsPressed(tripPattern: TripPattern, resultIndex?: number): void;
  errorType?: AxiosErrorKind;
  searchTime: TripSearchTime;
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
        case 'AXIOS_NETWORK_ERROR':
        case 'AXIOS_TIMEOUT':
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
        <MessageInfoBox
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
          illustrationComponent={<ThemedOnBehalfOf height={113} width={113} />}
          testID="searchResults"
        />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="tripSearchContentView">
      {tripPatterns
        .filter((tp) => !getIsTooLateToBookFlexLine(tp, now))
        .map((tripPattern, i) => (
          <Fragment key={tripPattern.key}>
            <DayLabel
              departureTime={tripPattern.expectedStartTime}
              previousDepartureTime={tripPatterns[i - 1]?.expectedStartTime}
            />
            <SaveableTripSearchResultRow tripPattern={tripPattern}>
              <ResultRow
                tripPattern={tripPattern}
                onDetailsPressed={onDetailsPressed}
                resultIndex={i}
                searchTime={searchTime}
                testID={'tripSearchSearchResult' + i}
              />
            </SaveableTripSearchResultRow>
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
    paddingBottom: theme.spacing.medium,
  },
  errorContainer: {
    paddingBottom: theme.spacing.medium,
  },
  infoBoxText: theme.typography.body__m,
  messageBoxContainer: {
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.medium,
  },
  emptyStateContainer: {
    marginTop: theme.spacing.medium,
  },
}));
