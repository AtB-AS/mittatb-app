import React, {Fragment} from 'react';
import {Text, View} from 'react-native';
import MessageBox from '../../message-box';
import {TripPattern} from '../../sdk';
import {StyleSheet, useTheme} from '../../theme';
import ResultItem from './ResultItem';
import OptionalNextDayLabel from '../../components/optional-day-header';

type Props = {
  tripPatterns: TripPattern[] | null;
  showEmptyScreen: boolean;
  isEmptyResult: boolean;
  isSearching: boolean;
  onDetailsPressed(tripPattern: TripPattern): void;
};

export type ResultTabParams = {
  [key: string]: {tripPattern: TripPattern};
};

const Results: React.FC<Props> = ({
  tripPatterns,
  showEmptyScreen,
  isEmptyResult,
  onDetailsPressed,
}) => {
  const {theme} = useTheme();
  const styles = useThemeStyles(theme);
  if (showEmptyScreen) {
    return null;
  }

  if (isEmptyResult) {
    return (
      <View style={styles.container}>
        <MessageBox>
          <Text style={styles.infoBoxText}>
            Vi fant dessverre ingen reiseruter som passer til ditt søk.
            Vennligst prøv et annet avreisested eller destinasjon.
          </Text>
        </MessageBox>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tripPatterns?.map((item, i) => (
        <React.Fragment key={String(item.id ?? i)}>
          <OptionalNextDayLabel
            departureTime={item.startTime}
            previousDepartureTime={tripPatterns[i - 1]?.startTime}
            allSameDay={false}
          />
          <ResultItem tripPattern={item} onDetailsPressed={onDetailsPressed} />
        </React.Fragment>
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
