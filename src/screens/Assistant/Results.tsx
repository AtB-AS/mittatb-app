import React, {Fragment, useMemo} from 'react';
import {Text, View} from 'react-native';
import MessageBox from '../../message-box';
import {TripPattern} from '../../sdk';
import {StyleSheet, useTheme} from '../../theme';
import ResultItem from './ResultItem';
import OptionalNextDayLabel from '../../components/optional-day-header';
import {isSeveralDays} from '../../utils/date';
import {NoResultReason} from './types';
import {ErrorType} from '../../api/utils';

type Props = {
  tripPatterns: TripPattern[] | null;
  showEmptyScreen: boolean;
  isEmptyResult: boolean;
  isSearching: boolean;
  resultReasons: NoResultReason[];
  onDetailsPressed(tripPattern: TripPattern): void;
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
  const {theme} = useTheme();
  const styles = useThemeStyles(theme);

  const allSameDay = useMemo(
    () => isSeveralDays((tripPatterns ?? []).map((i) => i.startTime)),
    [tripPatterns],
  );

  if (showEmptyScreen) {
    return null;
  }

  if (errorType) {
    return (
      <View style={styles.container}>
        <MessageBox
          type="warning"
          message={translateErrorType(errorType)}
        ></MessageBox>
      </View>
    );
  }

  if (isEmptyResult) {
    const hasResultReasons = !!resultReasons.length;
    const pluralResultReasons = hasResultReasons && resultReasons.length > 1;
    return (
      <View style={styles.container}>
        <MessageBox>
          <Text style={styles.infoBoxText}>
            Vi fant dessverre ingen reiseruter som passer til ditt søk.
            {pluralResultReasons && (
              <Text>
                {' '}
                Mulige årsaker:
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
              <Text> Prøv å justere på sted eller tidspunkt. </Text>
            )}
          </Text>
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
          <ResultItem tripPattern={item} onDetailsPressed={onDetailsPressed} />
        </Fragment>
      ))}
    </View>
  );
};

export default Results;

const useThemeStyles = StyleSheet.createTheme(() => ({
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  infoBoxText: {fontSize: 16},
}));

function translateErrorType(errorType: ErrorType): string {
  switch (errorType) {
    case 'network-error':
    case 'timeout':
      return 'Klarte ikke å søke opp reiseruter grunnet dårlig nettforbindelse. Har du skrudd på mobildata?';
    default:
      return 'Det oppstod en feil ved søk av reiseruter. Vennligst prøv igjen.';
  }
}
