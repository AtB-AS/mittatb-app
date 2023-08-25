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
import {ResultItem} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/Dashboard_TripSearchScreen/components/ResultItem';
import {TripPattern} from '@atb/api/types/trips';
import {TripPatternWithKey} from '@atb/travel-details-screens/types';
import {getIsTooLateToBookTripPattern} from '@atb/travel-details-screens/utils';
import {useNow} from '@atb/utils/use-now';

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

  const now = useNow(2500);

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
  }, [errorType]);

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
      <MessageBox
        type="info"
        style={styles.messageBoxContainer}
        message={getTextForEmptyResult(resultReasons, anyFiltersApplied, t)}
      />
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
            <ResultItem
              tripPattern={tripPattern}
              onDetailsPressed={() => {
                onDetailsPressed(tripPattern, i);
              }}
              searchTime={searchTime}
              testID={'tripSearchSearchResult' + i}
              resultNumber={i + 1}
            />
          </Fragment>
        ))}
    </View>
  );
};

const getTextForEmptyResult = (
  resultReasons: string[],
  anyFiltersApplied: boolean,
  t: TranslateFunction,
) => {
  let text = t(TripSearchTexts.results.info.emptyResult) + '\n\n';
  if (!resultReasons?.length) {
    text += anyFiltersApplied
      ? t(TripSearchTexts.results.info.genericHintWithFilters)
      : t(TripSearchTexts.results.info.genericHint);
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
}));
