import {DayLabel} from './DayLabel';
import {ScreenReaderAnnouncement} from '@atb/components/screen-reader-announcement';
import {MessageInfoBox} from '@atb/components/message-info-box';

import {StyleSheet} from '@atb/theme';
import {
  TranslateFunction,
  TravelCardTexts,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';

import React, {Fragment} from 'react';
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
import {useIsExperimentalEnabled} from '@atb/modules/experimental';
import {getTripPatternKey} from '@atb/modules/trip-patterns';
import {
  TravelCard,
  SkeletonBlock,
  WithTravelCardSkeleton,
} from '@atb/screen-components/travel-card';

const SKELETON_COUNT = 4;

type Props = {
  tripPatterns: TripPatternWithKey[];
  showEmptyScreen: boolean;
  isEmptyResult: boolean;
  isSearching: boolean;
  resultReasons: string[];
  onDetailsPressed(tripPattern: TripPattern, resultIndex?: number): void;
  tripsIsError: boolean;
  tripsIsNetworkError: boolean;
  searchTime: TripSearchTime;
};

export const Results: React.FC<Props> = ({
  tripPatterns,
  showEmptyScreen,
  isEmptyResult,
  isSearching,
  resultReasons,
  onDetailsPressed,
  tripsIsError,
  tripsIsNetworkError,
  searchTime,
}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();
  const now = useNow(30000);
  const isExperimentalEnabled = useIsExperimentalEnabled(
    'isNewTripSearchEnabled',
  );

  if (showEmptyScreen) {
    return null;
  }

  if (tripsIsError) {
    const errorMessage = t(
      TripSearchTexts.results.error[
        tripsIsNetworkError ? 'network' : 'generic'
      ],
    );
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
          details={getDetailsTextForEmptyResult(resultReasons, t)}
          illustrationComponent={<ThemedOnBehalfOf height={113} width={113} />}
          testID="searchResults"
        />
      </View>
    );
  }

  const filteredTripPatterns = tripPatterns.filter(
    (tp) => !getIsTooLateToBookFlexLine(tp, now),
  );

  if (isExperimentalEnabled) {
    const slotCount =
      filteredTripPatterns.length + (isSearching ? SKELETON_COUNT : 0);

    return (
      <View style={styles.container} testID="tripSearchContentView">
        {Array.from({length: slotCount}, (_, i) => {
          const tripPattern = filteredTripPatterns[i];
          return (
            <Fragment
              key={
                tripPattern ? getTripPatternKey(tripPattern) : `__skeleton_${i}`
              }
            >
              {tripPattern ? (
                <DayLabel
                  departureTime={tripPattern.expectedStartTime}
                  previousDepartureTime={
                    filteredTripPatterns[i - 1]?.expectedStartTime
                  }
                />
              ) : (
                i === 0 && <SkeletonBlock style={styles.dayLabelSkeleton} />
              )}
              <WithTravelCardSkeleton>
                {tripPattern &&
                  (({onReady}) => (
                    <SaveableTripSearchResultRow tripPattern={tripPattern}>
                      {(isSaved) => (
                        <TravelCard
                          tripPattern={tripPattern}
                          onDetailsPressed={onDetailsPressed}
                          testID={'tripSearchSearchResult' + i}
                          a11yLabelPrefix={t(
                            TravelCardTexts.card.a11yPrefix.tripSuggestion(
                              i,
                              filteredTripPatterns.length,
                            ),
                          )}
                          a11yHint={t(
                            TravelCardTexts.card.a11yHint.tripDetails,
                          )}
                          onReady={onReady}
                          isSaved={isSaved}
                        />
                      )}
                    </SaveableTripSearchResultRow>
                  ))}
              </WithTravelCardSkeleton>
            </Fragment>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container} testID="tripSearchContentView">
      {filteredTripPatterns.map((tripPattern, i) => (
        <Fragment key={tripPattern.key}>
          <DayLabel
            departureTime={tripPattern.expectedStartTime}
            previousDepartureTime={
              filteredTripPatterns[i - 1]?.expectedStartTime
            }
          />
          <SaveableTripSearchResultRow tripPattern={tripPattern}>
            {() => (
              <ResultRow
                tripPattern={tripPattern}
                onDetailsPressed={onDetailsPressed}
                resultIndex={i}
                searchTime={searchTime}
                testID={'tripSearchSearchResult' + i}
              />
            )}
          </SaveableTripSearchResultRow>
        </Fragment>
      ))}
    </View>
  );
};

const getDetailsTextForEmptyResult = (
  resultReasons: string[],
  t: TranslateFunction,
) => {
  let text = '';
  if (!resultReasons?.length) {
    text += t(TripSearchTexts.results.info.emptySearchResultsDetails);
  } else if (resultReasons.length === 1) {
    text += resultReasons[0];
  } else {
    text += t(TripSearchTexts.results.info.reasonsTitle);
    resultReasons.forEach((reason) => (text += `\n- ${reason}`));
  }
  return text;
};

const useThemeStyles = StyleSheet.createThemeHook((theme, _, {fontScale}) => ({
  container: {
    gap: theme.spacing.small,
    marginHorizontal: theme.spacing.medium,
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
  // Indented to match DayLabel's text.
  dayLabelSkeleton: {
    width: 50,
    height: theme.typography.body__s.lineHeight * fontScale,
    borderRadius: theme.border.radius.small,
    marginHorizontal: theme.spacing.medium,
  },
}));
