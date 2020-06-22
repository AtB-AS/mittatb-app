import React from 'react';
import {View, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';

import colors from '../../../theme/colors';
import {secondsToDuration, secondsBetween} from '../../../utils/date';
import {WalkingPerson} from '../../../assets/svg/icons/transportation';
import LocationRow from '../LocationRow';
import {LegDetailProps} from '.';
import WaitRow from './WaitRow';

const MINIMUM_WAIT_IN_SECONDS = 30;

const WalkDetail: React.FC<LegDetailProps> = ({
  leg,
  isIntermediateTravelLeg,
  nextLeg,
  onCalculateTime,
}) => {
  const showWaitTime = isIntermediateTravelLeg && Boolean(nextLeg);
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const isWalkTimeOfSignificance = leg.duration > MINIMUM_WAIT_IN_SECONDS;
  const isWaitTimeOfSignificance =
    showWaitTime && waitTimeInSeconds > MINIMUM_WAIT_IN_SECONDS;

  if (!isWalkTimeOfSignificance && isWaitTimeOfSignificance) {
    return (
      <View style={styles.container}>
        <Dash
          dashGap={8}
          dashLength={4}
          dashThickness={4}
          dashColor={colors.general.gray200}
          style={styles.dash}
          dashStyle={{borderRadius: 50}}
        />
        <WaitRow
          onCalculateTime={onCalculateTime}
          currentLeg={leg}
          nextLeg={nextLeg!}
        />
      </View>
    );
  }

  const walkTime = secondsToDuration(leg.duration ?? 0);
  const text = !isWaitTimeOfSignificance
    ? `Gå ${walkTime}`
    : `Gå ${walkTime}. Vent ${secondsToDuration(waitTimeInSeconds)}`;

  return (
    <View style={styles.container}>
      <Dash
        dashGap={8}
        dashLength={4}
        dashThickness={4}
        dashColor={colors.general.gray200}
        style={styles.dash}
        dashStyle={{borderRadius: 50}}
      />
      {isWalkTimeOfSignificance ? (
        <LocationRow
          icon={<WalkingPerson fill={colors.general.gray200} />}
          location={text}
          textStyle={styles.walkTextStyle}
          rowStyle={styles.walkRowStyle}
        />
      ) : (
        <View style={styles.empty} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  dash: {
    marginLeft: 89,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
  walkTextStyle: {opacity: 0.6, fontSize: 12},
  walkRowStyle: {
    marginBottom: 24,
    marginTop: 20,
  },
  empty: {
    height: 20,
  },
});

export default WalkDetail;
