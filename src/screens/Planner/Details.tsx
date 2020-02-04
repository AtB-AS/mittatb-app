import React from 'react';
import {Leg} from '../../sdk';
import {View, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {RouteProp} from '@react-navigation/native';
import {PlannerStackParams} from './';
import colors from '../../assets/colors';
import ResultItem from './Overview/ResultItem';
import {formatToClock, secondsToDuration} from '../../utils/date';
import nb from 'date-fns/locale/nb';
import WalkingPerson from '../../assets/svg/WalkingPerson';
import BusFront from '../../assets/svg/BusFront';
import DotIcon from '../../assets/svg/DotIcon';

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
      <ScrollView
        style={{
          flex: 1,
          borderTopWidth: 1,
          borderTopColor: '#F9F9FA0D',
          padding: 12,
        }}
      >
        {tripPattern.legs.map((leg, i, {length}) => (
          <LegDetail leg={leg} isLast={i === length - 1} />
        ))}
      </ScrollView>
    </View>
  );
};

type LegDetailProps = {
  leg: Leg;
  isLast: boolean;
};

const LegDetail: React.FC<LegDetailProps> = props => {
  const {leg} = props;
  switch (leg.mode) {
    case 'foot':
      return <WalkDetail {...props} />;
    case 'bus':
      return <BusDetail {...props} />;
    case 'tram':
      return <BusDetail {...props} />;
    default:
      return <WalkDetail {...props} />;
  }
};

const BusDetail: React.FC<LegDetailProps> = ({leg, isLast}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 18, alignItems: 'center'}}>
            <DotIcon fill={colors.primary.green} />
          </View>
          <Text style={{color: colors.general.white}}>
            {leg.fromPlace.name}
          </Text>
        </View>
        <Text style={{color: colors.general.white}}>
          {formatToClock(leg.aimedStartTime)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 18, alignItems: 'center'}}>
            <BusFront fill={colors.primary.green} />
          </View>
          <Text style={{color: colors.primary.green}}>{leg.line?.name}</Text>
        </View>
        <Text style={{color: colors.primary.green}}>
          {secondsToDuration(leg.duration ?? 0, nb)} /{' '}
          {leg.intermediateQuays.length} stopp
        </Text>
      </View>

      {isLast ? <EndDetail leg={leg} /> : null}
    </>
  );
};

const WalkDetail: React.FC<LegDetailProps> = ({leg, isLast}) => {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 18, alignItems: 'center'}}>
            <DotIcon />
          </View>
          <Text style={{color: colors.general.white}}>
            {leg.fromPlace.name}
          </Text>
        </View>
        <Text style={{color: colors.general.white}}>
          {formatToClock(leg.aimedStartTime)}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{width: 18, alignItems: 'center'}}>
            <WalkingPerson />
          </View>
          <Text style={{color: colors.general.white}}>
            Gå {Math.floor(leg.distance ?? 0)} m
          </Text>
        </View>
        <Text style={{color: colors.general.white}}>
          {secondsToDuration(leg.duration ?? 0, nb)}
        </Text>
      </View>
      {isLast ? <EndDetail leg={leg} /> : null}
    </>
  );
};

const EndDetail: React.FC<{leg: Leg}> = ({leg}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
      }}
    >
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{width: 18, alignItems: 'center'}}>
          <DotIcon />
        </View>
        <Text style={{color: colors.general.white}}>{leg.toPlace.name}</Text>
      </View>
      <Text style={{color: colors.general.white}}>
        {formatToClock(leg.aimedEndTime)}
      </Text>
    </View>
  );
};

export default Detail;
