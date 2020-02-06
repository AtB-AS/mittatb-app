import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';
import colors from '../../../assets/colors';
import {formatToClock, secondsToDuration} from '../../../utils/date';
import nb from 'date-fns/locale/nb';
import BusFront from '../../../assets/svg/BusFront';
import DotIcon from '../../../assets/svg/DotIcon';
import {LegDetailProps} from './';
import LocationRow from './LocationRow';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const BusDetail: React.FC<LegDetailProps> = ({leg}) => {
  const [showStops, setShowStops] = useState(false);
  return (
    <TouchableWithoutFeedback
      style={styles.pressable}
      onPress={() => setShowStops(!showStops)}
    >
      <Dash
        dashGap={0}
        dashThickness={4}
        dashLength={10}
        dashColor={colors.primary.green}
        style={styles.dash}
      />
      <View style={styles.container}>
        <LocationRow
          icon={<DotIcon fill={colors.primary.green} />}
          location={leg.fromPlace.name}
          time={formatToClock(leg.aimedStartTime)}
        />
        <LocationRow
          icon={<BusFront fill={colors.primary.green} />}
          location={
            leg.line ? leg.line.publicCode + ' ' + leg.line.name : 'Ukjent'
          }
          time={
            secondsToDuration(leg.duration ?? 0, nb) +
            ' / ' +
            leg.intermediateEstimatedCalls.length +
            ' stopp'
          }
          textStyle={{color: colors.primary.green}}
        />

        <View />
      </View>
      {showStops ? (
        <View style={styles.stopContainer}>
          {leg.intermediateEstimatedCalls.map(call => (
            <LocationRow
              key={call.quay.id}
              icon={<DotIcon fill={colors.primary.green} width={8} />}
              location={call.quay.name}
              time={formatToClock(
                call.expectedDepartureTime ?? call.aimedDepartureTime,
              )}
              dashThroughIcon={true}
              textStyle={styles.stopTextStyle}
            />
          ))}
        </View>
      ) : null}
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  pressable: {flexDirection: 'column'},
  container: {
    minHeight: 100,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  dash: {
    marginLeft: 7,
    opacity: 0.6,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
  stopContainer: {marginBottom: 30},
  stopTextStyle: {opacity: 0.6, fontSize: 12},
});

export default BusDetail;
