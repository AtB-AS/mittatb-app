import {ErrorType} from '@atb/api/utils';
import OptionalNextDayLabel from '@atb/components/optional-day-header';
import ScreenReaderAnnouncement from '@atb/components/screen-reader-announcement';
import ThemeText from '@atb/components/text';
import MessageBox from '@atb/components/message-box';

import {StyleSheet, useTheme} from '@atb/theme';
import {AssistantTexts, useTranslation} from '@atb/translations';
import {isSeveralDays} from '@atb/utils/date';
import React, {Fragment, useEffect, useMemo, useState} from 'react';
import {Text, View} from 'react-native';

import ResultItem from '@atb/screens/Assistant_v2/ResultItem';
import {TripPattern} from '@atb/api/types/trips';

type Props = {
  tripPatterns: TripPattern[] | null;
  showEmptyScreen: boolean;
  isEmptyResult: boolean;
  isSearching: boolean;
  resultReasons: String[];
  onDetailsPressed(
    tripPatternId?: string,
    tripPatterns?: TripPattern[],
    index?: number,
  ): void;
  errorType?: ErrorType;
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
          setErrorMessage(t(AssistantTexts.results.error.network));
          break;
        default:
          setErrorMessage(t(AssistantTexts.results.error.generic));
          break;
      }
    }
  }, [errorType]);

  const allSameDay = useMemo(
    () => isSeveralDays((tripPatterns ?? []).map((i) => i.expectedStartTime)),
    [tripPatterns],
  );

  if (showEmptyScreen) {
    return null;
  }
  if (errorType) {
    return (
      <View style={styles.container}>
        <ScreenReaderAnnouncement message={errorMessage} />
        <MessageBox type="warning" message={errorMessage} />
      </View>
    );
  }

  if (isEmptyResult) {
    const hasResultReasons = !!resultReasons.length;
    const pluralResultReasons = hasResultReasons && resultReasons.length > 1;
    return (
      <View style={styles.container}>
        <MessageBox>
          <ThemeText
            style={{...styles.infoBoxText, color: theme.status.info.main.color}}
          >
            {t(AssistantTexts.results.info.emptyResult)}
            {pluralResultReasons && (
              <Text>
                {' '}
                {t(AssistantTexts.results.info.reasonsTitle)}
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
              <Text>{t(AssistantTexts.results.info.genericHint)}</Text>
            )}
          </ThemeText>
        </MessageBox>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tripPatterns?.map((tripPattern, i) => (
        <Fragment key={String(tripPattern.id ?? i)}>
          <OptionalNextDayLabel
            departureTime={tripPattern.expectedStartTime}
            previousDepartureTime={tripPatterns[i - 1]?.expectedStartTime}
            allSameDay={allSameDay}
          />
          <ResultItem
            tripPattern={tripPattern}
            onDetailsPressed={() => {
              onDetailsPressed(tripPattern.id, tripPatterns, i);
            }}
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
}));
