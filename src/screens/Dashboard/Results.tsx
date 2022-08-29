import {ErrorType} from '@atb/api/utils';
import DayLabel from '@atb/components/day-label';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import ThemeText from '@atb/components/text';
import MessageBox from '@atb/components/message-box';

import {StyleSheet, useTheme} from '@atb/theme';
import {TripSearchTexts, useTranslation} from '@atb/translations';
import {isSeveralDays} from '@atb/utils/date';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';

import ResultItem from '@atb/screens/Dashboard/ResultItem';
import {TripPattern} from '@atb/api/types/trips';
import {TripPatternWithKey} from '@atb/screens/Dashboard/types';
import {SearchTime} from '@atb/screens/Dashboard/journey-date-picker';

type Props = {
  tripPatterns: TripPatternWithKey[];
  showEmptyScreen: boolean;
  isEmptyResult: boolean;
  isSearching: boolean;
  resultReasons: String[];
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
          containerStyle={styles.messageBoxContainer}
        />
      </View>
    );
  }

  if (isEmptyResult) {
    const hasResultReasons = !!resultReasons.length;
    const pluralResultReasons = hasResultReasons && resultReasons.length > 1;
    return (
      <View style={styles.container}>
        <MessageBox containerStyle={styles.messageBoxContainer}>
          <ThemeText
            style={{
              ...styles.infoBoxText,
              color: theme.static.status.info.text,
            }}
          >
            {t(TripSearchTexts.results.info.emptyResult)}
            {pluralResultReasons && (
              <Text>
                {' '}
                {t(TripSearchTexts.results.info.reasonsTitle)}
                {resultReasons.map((reason, i) => (
                  <Text key={i}>
                    {'\n'}- {reason}
                  </Text>
                ))}
              </Text>
            )}
            {hasResultReasons && !pluralResultReasons && (
              <Text> {resultReasons[0]}.</Text>
            )}
            {!hasResultReasons && (
              <Text>{t(TripSearchTexts.results.info.genericHint)}</Text>
            )}
          </ThemeText>
        </MessageBox>
      </View>
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

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    paddingHorizontal: theme.spacings.medium,
    paddingBottom: theme.spacings.medium,
  },
  infoBoxText: theme.typography.body__primary,
  messageBoxContainer: {
    marginTop: theme.spacings.medium,
  },
}));
