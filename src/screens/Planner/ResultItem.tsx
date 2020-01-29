import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import nb from 'date-fns/locale/nb';
import colors from '../../assets/colors';
import {TripPattern} from '../../sdk';
import {format, parseISO} from 'date-fns';
import {secondsToDuration} from '../../utils/date';
import LegIcons from './LegIcons';

type ResultItemProps = {
  tripPattern: TripPattern;
};

const ResultItem: React.FC<ResultItemProps> = ({tripPattern}) => {
  return (
    <View style={styles.container}>
      <View style={styles.legContainer}>
        <Text style={styles.timeText}>
          {format(parseISO(tripPattern.startTime), 'HH:mm')} -{' '}
          {format(parseISO(tripPattern.endTime), 'HH:mm')}
        </Text>
        <Text style={styles.timeText}>
          {secondsToDuration(tripPattern.duration, nb)}
        </Text>
      </View>
      <View style={styles.legContainer}>
        <Text style={styles.distanceText}>
          Fra {tripPattern.legs[0].toPlace.name} (
          {tripPattern.walkDistance.toFixed(0)} m)
        </Text>

        <LegIcons legs={tripPattern.legs} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: '#F9F9FA0D',
    width: '100%',
    padding: 12,
  },
  timeContainer: {flexDirection: 'row', justifyContent: 'space-between'},
  legContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {fontSize: 20, color: colors.general.white},
  distanceText: {fontSize: 12, color: colors.general.white},
});

export default ResultItem;
