import React from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import {TripPattern} from '../../sdk';
import {StyleSheet, useTheme} from '../../theme';
import ResultItem from './ResultItem';
import {AssistantScreenNavigationProp} from './';
import {ScrollView} from 'react-native-gesture-handler';
import InfoIcon from '../../assets/svg/InfoIcon';
import colors from '../../theme/colors';

type Props = {
  tripPatterns: TripPattern[] | null;
  isSearching: boolean;
  navigation: AssistantScreenNavigationProp;
  onDetailsPressed(tripPattern: TripPattern): void;
};

export type ResultTabParams = {
  [key: string]: {tripPattern: TripPattern};
};

const Results: React.FC<Props> = ({
  tripPatterns,
  isSearching,
  onDetailsPressed,
}) => {
  const {theme} = useTheme();
  const styles = useThemeStyles(theme);

  if (isSearching) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  if (!tripPatterns) {
    return null;
  }

  if (!tripPatterns.length) {
    return (
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <View style={styles.infoBoxIcon}>
            <InfoIcon />
          </View>
          <Text style={styles.infoBoxText}>
            Vi fant dessverre ingen reiseruter som passer til ditt søk. {'\n'}
            Vennligst prøv et annet avreisested eller destinasjon.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {tripPatterns.map((tripPattern, i) => (
        <View key={i}>
          <ResultItem
            tripPattern={tripPattern}
            onDetailsPressed={onDetailsPressed}
          />
        </View>
      ))}
    </ScrollView>
  );
};

export default Results;

const useThemeStyles = StyleSheet.createTheme((theme) => ({
  container: {
    marginTop: 12,
    marginBottom: 0,
  },
  infoBox: {
    backgroundColor: colors.secondary.cyan,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 327,
    paddingVertical: 8,
    paddingRight: 12,
  },
  infoBoxIcon: {padding: 12},
  infoBoxText: {fontSize: 16, flex: 1, flexWrap: 'wrap'},
  spinner: {height: 280},
  detailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    zIndex: 1,
    position: 'absolute',
  },
  button: {
    zIndex: 1,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPager: {height: 280, width: '100%'},
  timeText: {
    fontSize: 28,
    color: theme.text.primary,
  },
  locationText: {
    fontSize: 12,
    color: theme.text.primary,
    marginTop: 8,
  },
}));
