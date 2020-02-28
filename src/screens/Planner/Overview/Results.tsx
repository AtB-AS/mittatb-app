import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {differenceInSeconds, formatDistanceStrict, parseISO} from 'date-fns';
import {nb} from 'date-fns/locale';
import {TripPattern} from '../../../sdk';
import {Location} from '../../../AppContext';
import colors from '../../../theme/colors';
import ResultItem from './ResultItem';
import {OverviewScreenNavigationProp} from './';

type Props = {
  tripPatterns: TripPattern[] | null;
  from: Location;
  to: Location;
  isSearching: boolean;
  search: () => void;
  navigation: OverviewScreenNavigationProp;
};

const Results: React.FC<Props> = ({
  tripPatterns,
  from,
  to,
  isSearching,
  search,
  navigation,
}) => {
  if (!tripPatterns) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }
  return (
    <>
      <View style={styles.textContainer}>
        {tripPatterns.length > 0 ? (
          differenceInSeconds(Date.now(), parseISO(tripPatterns[0].startTime)) >
          60 ? (
            <>
              <Text style={styles.callToActionText}>Du må gå innen</Text>
              <Text style={styles.timeText}>
                {formatDistanceStrict(
                  Date.now(),
                  parseISO(tripPatterns[0].startTime),
                  {locale: nb, onlyNumeric: true},
                )}
              </Text>
            </>
          ) : (
            <Text style={styles.callToActionText}>Du bør gå nå</Text>
          )
        ) : null}
        <Text style={styles.locationText}>
          Fra {from.id === 'current' ? from.name.toLowerCase() : from.name} til{' '}
          {to.name}
        </Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isSearching} onRefresh={search} />
        }
      >
        {tripPatterns.map((pattern, i) => (
          <ResultItem
            key={i}
            tripPattern={pattern}
            onPress={tripPattern =>
              navigation.push('Detail', {tripPattern, from, to})
            }
          />
        ))}
        <View></View>
      </ScrollView>
    </>
  );
};

export default Results;

const styles = StyleSheet.create({
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 48,
  },
  spinner: {padding: 72},
  callToActionText: {
    fontSize: 16,
    color: colors.general.white,
  },
  timeText: {
    fontSize: 28,
    color: colors.general.white,
  },
  locationText: {
    fontSize: 12,
    color: colors.general.white,
    marginTop: 8,
  },
});
