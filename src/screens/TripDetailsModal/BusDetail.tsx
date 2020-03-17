import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';
import colors from '../../theme/colors';
import {formatToClock, secondsToDuration} from '../../utils/date';
import nb from 'date-fns/locale/nb';
import BusFront from '../../assets/svg/BusFront';
import DotIcon from '../../assets/svg/DotIcon';
import {LegDetailProps} from '.';
import LocationRow from './LocationRow';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

const BusDetail: React.FC<LegDetailProps> = ({leg}) => {
  const [showStops, setShowStops] = useState(false);
  console.log(leg);
  return (
    <TouchableWithoutFeedback
      style={styles.pressable}
      onPress={() => setShowStops(!showStops)}
    >
      <Dash
        dashGap={4}
        dashThickness={8}
        dashLength={8}
        dashColor={colors.primary.green}
        style={styles.dash}
        dashStyle={{borderRadius: 50}}
      />
      <View style={styles.container}>
        <LocationRow
          icon={<DotIcon fill={colors.primary.green} />}
          location={leg.fromPlace.name}
          time={formatToClock(leg.aimedStartTime)}
          textStyle={styles.textStyle}
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
          textStyle={styles.textStyle}
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
  textStyle: {fontSize: 16},
  dash: {
    marginLeft: 5,
    opacity: 0.6,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
  stopContainer: {marginBottom: 28},
  stopTextStyle: {opacity: 0.6, fontSize: 16},
});

export default BusDetail;
