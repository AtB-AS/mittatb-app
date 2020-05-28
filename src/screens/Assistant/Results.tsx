import React from 'react';
import {RefreshControl, Text, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import MessageBox from '../../message-box';
import {TripPattern} from '../../sdk';
import {StyleSheet, useTheme} from '../../theme';
import {AssistantScreenNavigationProp} from './';
import ResultItem from './ResultItem';

type Props = {
  tripPatterns: TripPattern[] | null;
  isSearching: boolean;
  onRefresh: () => void;
  navigation: AssistantScreenNavigationProp;
  onDetailsPressed(tripPattern: TripPattern): void;
};

export type ResultTabParams = {
  [key: string]: {tripPattern: TripPattern};
};

const Results: React.FC<Props> = ({
  tripPatterns,
  isSearching,
  onRefresh,
  onDetailsPressed,
}) => {
  const {theme} = useTheme();
  const styles = useThemeStyles(theme);

  if (!tripPatterns && !isSearching) {
    return null;
  }

  if (!isSearching && !tripPatterns?.length) {
    return (
      <View style={[styles.scrollContainer, styles.container]}>
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
    <FlatList
      style={styles.scrollContainer}
      contentContainerStyle={styles.container}
      data={tripPatterns}
      refreshControl={
        <RefreshControl refreshing={isSearching} onRefresh={onRefresh} />
      }
      keyExtractor={(item, i) => String(item.id ?? i)}
      renderItem={({item}) => (
        <ResultItem tripPattern={item} onDetailsPressed={onDetailsPressed} />
      )}
    />
  );
};

export default Results;

const useThemeStyles = StyleSheet.createTheme((theme) => ({
  scrollContainer: {
    marginTop: 12,
    flex: 1,
  },
  container: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    // flexGrow: 1,
  },
  infoBoxText: {fontSize: 16},
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
