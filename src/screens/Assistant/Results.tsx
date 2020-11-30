import React, {Fragment, useMemo, useState, useEffect} from 'react';
import {Text, View} from 'react-native';
import {TripPattern} from '../../sdk';
import {StyleSheet, useTheme} from '../../theme';
import ResultItem from './ResultItem';
import OptionalNextDayLabel from '../../components/optional-day-header';
import {isSeveralDays} from '../../utils/date';
import {NoResultReason} from './types';
import {screenReaderPause} from '../../components/accessible-text';
import ThemeText from '../../components/text';
import MessageBox from '../../message-box';
import {ErrorType} from '../../api/utils';
import {AssistantTexts} from '../../translations';
import {useTranslation} from '../../utils/language';
import ScreenReaderAnnouncement from '../../components/screen-reader-announcement';
type Props = {
  tripPatterns: TripPattern[] | null;
  showEmptyScreen: boolean;
  isEmptyResult: boolean;
  isSearching: boolean;
  resultReasons: NoResultReason[];
  onDetailsPressed(tripPattern: TripPattern): void;
  error?: ErrorType;
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
  error,
}) => {
  const styles = useThemeStyles();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const {t} = useTranslation();

  useEffect(() => {
    if (error) {
      switch (error) {
        case 'network-error':
        case 'timeout':
          setErrorMessage(t(AssistantTexts.results.error.network));
          break;
        default:
          setErrorMessage(t(AssistantTexts.results.error.generic));
          break;
      }
    }
  }, [error]);

  const allSameDay = useMemo(
    () => isSeveralDays((tripPatterns ?? []).map((i) => i.startTime)),
    [tripPatterns],
  );

  if (showEmptyScreen) {
    return null;
  }
  if (error) {
    return (
      <View style={styles.container}>
        <ScreenReaderAnnouncement message={errorMessage} />
        <MessageBox type="warning" message={errorMessage}></MessageBox>
      </View>
    );
  }

  if (isEmptyResult) {
    const hasResultReasons = !!resultReasons.length;
    const pluralResultReasons = hasResultReasons && resultReasons.length > 1;
    return (
      <View style={styles.container}>
        <MessageBox>
          <ThemeText style={styles.infoBoxText}>
            {t(AssistantTexts.results.info.emptyResult)}
            {pluralResultReasons && (
              <Text>
                {' '}
                {AssistantTexts.results.info.reasonsTitle}
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
      {tripPatterns?.map((item, i) => (
        <Fragment key={String(item.id ?? i)}>
          <OptionalNextDayLabel
            departureTime={item.startTime}
            previousDepartureTime={tripPatterns[i - 1]?.startTime}
            allSameDay={allSameDay}
          />
          <ResultItem
            tripPattern={item}
            onDetailsPressed={onDetailsPressed}
            accessibilityLabel={
              t(
                AssistantTexts.results.resultList.listPositionExplanation(
                  i + 1,
                  tripPatterns.length,
                ),
              ) + screenReaderPause
            }
            accessibilityRole="button"
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
  infoBoxText: theme.text.body,
}));
