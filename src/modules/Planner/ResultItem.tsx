import React from 'react';
import {View, Text} from 'react-native';
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
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: '#F9F9FA0D',
        width: '100%',
        padding: 12,
      }}
    >
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontSize: 20, color: colors.general.white}}>
          {format(parseISO(tripPattern.startTime), 'HH:mm')} -{' '}
          {format(parseISO(tripPattern.endTime), 'HH:mm')}
        </Text>
        <Text style={{fontSize: 20, color: colors.general.white}}>
          {secondsToDuration(tripPattern.duration, nb)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 8,
        }}
      >
        <Text style={{fontSize: 12, color: colors.general.white}}>
          Fra {tripPattern.legs[0].toPlace.name} (
          {tripPattern.walkDistance.toFixed(0)} m)
        </Text>

        <LegIcons legs={tripPattern.legs} />
      </View>
    </View>
  );
};

export default ResultItem;
