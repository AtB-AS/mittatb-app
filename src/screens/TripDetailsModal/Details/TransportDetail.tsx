import React from 'react';
import {View, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';
import colors from '../../../theme/colors';
import {formatToClock} from '../../../utils/date';
import {Dot} from '../../../assets/svg/icons/other';
import LocationRow from '../LocationRow';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {LegDetailProps, DetailScreenNavigationProp} from '.';
import {useNavigation} from '@react-navigation/core';
import TransportationIcon from '../../../components/transportation-icon';
import {getQuayName, getLineName} from '../../../utils/transportation-names';
import {getAimedTimeIfLargeDifference} from '../utils';
import WaitRow from './WaitRow';

const TransportDetail: React.FC<LegDetailProps> = ({
  leg,
  nextLeg,
  isIntermediateTravelLeg,
  onCalculateTime,
  showFrom,
  showTo,
}) => {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const showWaitTime = isIntermediateTravelLeg && Boolean(nextLeg);

  return (
    <View>
      <TouchableOpacity
        style={styles.pressable}
        onPress={() =>
          navigation.navigate('DepartureDetails', {
            title: getLineName(leg),
            serviceJourneyId: leg.serviceJourney.id,
            fromQuayId: leg.fromPlace.quay?.id,
            toQuayId: leg.toPlace.quay?.id,
            isBack: true,
          })
        }
      >
        {showFrom && (
          <LocationRow
            icon={<Dot fill={colors.secondary.cyan} />}
            location={getQuayName(leg.fromPlace.quay)}
            time={formatToClock(leg.expectedStartTime)}
            aimedTime={
              leg.realtime
                ? getAimedTimeIfLargeDifference(leg.fromEstimatedCall)
                : undefined
            }
            timeStyle={{fontWeight: 'bold', fontSize: 16}}
            textStyle={styles.textStyle}
          />
        )}
        <View style={styles.container}>
          <Dash
            dashGap={4}
            dashThickness={8}
            dashLength={8}
            dashColor={colors.secondary.cyan}
            style={styles.dash}
            dashStyle={{borderRadius: 50}}
          />
          <LocationRow
            icon={
              <TransportationIcon
                mode={leg.mode}
                publicCode={leg.line?.publicCode}
              />
            }
            location={getLineName(leg)}
            textStyle={[styles.textStyle, styles.activeTextStyle]}
            rowStyle={styles.midRowStyle}
          />
        </View>
        {showTo && (
          <LocationRow
            icon={<Dot fill={colors.secondary.cyan} />}
            location={getQuayName(leg.toPlace.quay)}
            time={formatToClock(leg.expectedEndTime)}
            aimedTime={
              leg.realtime
                ? getAimedTimeIfLargeDifference(leg.toEstimatedCall)
                : undefined
            }
            textStyle={styles.textStyle}
          />
        )}
      </TouchableOpacity>
      {showWaitTime && (
        <WaitRow
          onCalculateTime={onCalculateTime}
          currentLeg={leg}
          nextLeg={nextLeg!}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {flexDirection: 'column', paddingVertical: 5},
  container: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  midRowStyle: {marginVertical: 20},
  textStyle: {fontSize: 16},
  activeTextStyle: {fontWeight: '600'},
  dash: {
    marginLeft: 87,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
});

export default TransportDetail;
