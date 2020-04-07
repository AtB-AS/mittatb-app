import React, {useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';
import colors from '../../../theme/colors';
import {
  formatToClock,
  secondsToDuration,
  secondsBetween,
} from '../../../utils/date';
import nb from 'date-fns/locale/nb';
import DotIcon from '../../../assets/svg/DotIcon';
import LocationRow from '../LocationRow';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {LegDetailProps, DetailScreenNavigationProp} from '.';
import {useNavigation} from '@react-navigation/core';
import WaitClockIcon from './svg/WaitClockIcon';
import {Leg} from '../../../sdk';
import RealTimeLocationIcon from '../../../components/location-icon/real-time';
import {getQuayName, getLineName} from '../../../utils/transportation-names';

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
            icon={<DotIcon fill={colors.primary.green} />}
            location={getQuayName(leg.fromPlace.quay)}
            time={formatToClock(leg.aimedStartTime)}
            textStyle={styles.textStyle}
          />
        )}
        <View style={styles.container}>
          <Dash
            dashGap={4}
            dashThickness={8}
            dashLength={8}
            dashColor={colors.primary.green}
            style={styles.dash}
            dashStyle={{borderRadius: 50}}
          />
          <LocationRow
            icon={
              <RealTimeLocationIcon mode={leg.mode} isLive={leg.realtime} />
            }
            location={getLineName(leg)}
            textStyle={[styles.textStyle, styles.activeTextStyle]}
            rowStyle={styles.midRowStyle}
          />
        </View>
        {showTo && (
          <LocationRow
            icon={<DotIcon fill={colors.primary.green} />}
            location={getQuayName(leg.toPlace.quay)}
            time={formatToClock(leg.aimedEndTime)}
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
  pressable: {flexDirection: 'column'},
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

type WaitRowProps = {
  onCalculateTime(seconds: number): void;
  currentLeg: Leg;
  nextLeg: Leg;
};
function WaitRow({onCalculateTime, currentLeg, nextLeg}: WaitRowProps) {
  const time = secondsBetween(
    currentLeg.aimedEndTime ?? currentLeg.expectedEndTime,
    nextLeg.aimedStartTime ?? nextLeg.expectedStartTime,
  );

  useEffect(() => {
    onCalculateTime(time);
  }, [time]);

  return (
    <View style={waitStyles.container}>
      <View style={waitStyles.textContainer}>
        <Text style={waitStyles.text}>{secondsToDuration(time, nb)}</Text>
      </View>
      <WaitClockIcon fill={colors.general.gray200} />
    </View>
  );
}
const waitStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 12,
    marginBottom: 12,
  },
  textContainer: {
    width: 70,
    marginRight: 12,
    alignItems: 'flex-end',
  },
  text: {
    fontSize: 12,
    opacity: 0.6,
  },
});
