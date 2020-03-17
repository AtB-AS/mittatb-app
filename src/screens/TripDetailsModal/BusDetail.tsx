import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';
import colors from '../../theme/colors';
import {formatToClock, secondsToDuration} from '../../utils/date';
import nb from 'date-fns/locale/nb';
import DotIcon from '../../assets/svg/DotIcon';
import {LegDetailProps} from '.';
import LocationRow from './LocationRow';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import BusLegIcon from './svg/BusLegIcon';
import {Leg} from '../../sdk';

const BusDetail: React.FC<LegDetailProps> = ({leg}) => {
  const [showStops, setShowStops] = useState(false);
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
          icon={<BusLegIcon />}
          location={lineName(leg)}
          time={secondsToDuration(leg.duration ?? 0, nb)}
          textStyle={[styles.textStyle, styles.activeTextStyle]}
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
  activeTextStyle: {fontWeight: '600'},
  dash: {
    marginLeft: 87,
    opacity: 0.6,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
  stopContainer: {marginBottom: 28},
  stopTextStyle: {opacity: 0.6, fontSize: 16},
});

export default BusDetail;

const lineName = (leg: Leg) =>
  leg.line
    ? leg.line.publicCode +
        ' ' +
        leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line.name
    : 'Ukjent';
