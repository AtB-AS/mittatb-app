import {ErrorType} from '@atb/api/utils';
import DayLabel from '@atb/components/day-label';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import {MessageBox} from '@atb/components/message-box';

import {StyleSheet, useTheme} from '@atb/theme';
import {
  TranslateFunction,
  TripSearchTexts,
  useTranslation,
} from '@atb/translations';
import {isSeveralDays} from '@atb/utils/date';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';

import ResultItem from '@atb/screens/Dashboard/ResultItem';
import {TripPattern} from '@atb/api/types/trips';
import {TripPatternWithKey} from '@atb/screens/Dashboard/types';
import {SearchTime} from '@atb/screens/Dashboard/journey-date-picker';

type Props = {
  tripPatterns: TripPatternWithKey[];
  showEmptyScreen: boolean;
  isEmptyResult: boolean;
  isSearching: boolean;
  resultReasons: string[];
  onDetailsPressed(tripPatterns?: TripPattern[], index?: number): void;
  errorType?: ErrorType;
  searchTime: SearchTime;
};

export type ResultTabParams = {
  [key: string]: {tripPattern: TripPattern};
};

const Results: React.FC<Props> = ({
  tripPatterns,
  showEmptyScreen,
  isEmptyResult,
  resultReasons,
  onDetailsPressed,
  errorType,
  searchTime,
}) => {
  const styles = useThemeStyles();
  const {theme} = useTheme();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const {t} = useTranslation();

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

  const allSameDay = useMemo(
    () => isSeveralDays(tripPatterns.map((i) => i.expectedStartTime)),
    [tripPatterns],
  );

  if (showEmptyScreen) {
    return null;
  }

  if (errorType) {
    return (
      <View style={styles.container}>
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
        message={getTextForEmptyResult(resultReasons, t)}
      />
    );
  }

  return (
    <View style={styles.container} testID="tripSearchContentView">
      {tripPatterns?.map((tripPattern, i) => (
        <Fragment key={tripPattern.key}>
          <DayLabel
            departureTime={tripPattern.expectedStartTime}
            previousDepartureTime={tripPatterns[i - 1]?.expectedStartTime}
            allSameDay={allSameDay}
          />
          <ResultItem
            tripPattern={tripPattern}
            onDetailsPressed={() => {
              onDetailsPressed(tripPatterns, i);
            }}
            searchTime={searchTime}
            testID={'tripSearchSearchResult' + i}
          />
        </Fragment>
      ))}
    </View>
  );
};

export default Results;

const getTextForEmptyResult = (
  resultReasons: string[],
  t: TranslateFunction,
) => {
  let text = t(TripSearchTexts.results.info.emptyResult) + '\n\n';
  if (!resultReasons?.length) {
    text += t(TripSearchTexts.results.info.genericHint);
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
  infoBoxText: theme.typography.body__primary,
  messageBoxContainer: {
    margin: theme.spacings.medium,
  },
}));
