import React from 'react';
import {TripPattern} from '../../sdk';
import {View, Text} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {PlannerStackParams} from './';
import colors from '../../assets/colors';
import ResultItem from './ResultItem';

type DetailScreenRouteProp = RouteProp<PlannerStackParams, 'Detail'>;

type Props = {
  route: DetailScreenRouteProp;
};

const Detail: React.FC<Props> = ({
  route: {
    params: {tripPattern},
  },
}) => {
  return (
    <View style={{flex: 1, backgroundColor: colors.primary.gray}}>
      <ResultItem tripPattern={tripPattern} />
      <View style={{borderTopWidth: 1, borderTopColor: '#F9F9FA0D'}}></View>
    </View>
  );
};

export default Detail;
