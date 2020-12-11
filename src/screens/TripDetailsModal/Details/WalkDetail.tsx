import React from 'react';
import {View, StyleSheet} from 'react-native';
import Dash from 'react-native-dash';

import {secondsToDuration, secondsBetween} from '../../../utils/date';
import {WalkingPerson} from '../../../assets/svg/icons/transportation';
import {LegDetailProps} from './index_old';
import WaitRow from './components/WaitRow';
import ThemeText from '../../../components/text';
import ThemeIcon from '../../../components/theme-icon';
import {defaultFill} from '../../../utils/transportation-color';

import {TripDetailsTexts, useTranslation} from '../../../translations';

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
  const showRow = isWaitTimeOfSignificance || isWalkTimeOfSignificance;
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      {showRow ? (
        <>
          <Dash
            dashGap={4}
            dashLength={4}
            dashThickness={4}
            dashCount={3}
            dashColor={defaultFill}
            style={styles.dash}
          />
          <View>
            {isWalkTimeOfSignificance && (
              <View style={styles.walkContainer}>
                <ThemeIcon svg={WalkingPerson} opacity={0.6} />
                <ThemeText style={styles.walkText}>
                  {t(
                    TripDetailsTexts.legs.walk.label(
                      secondsToDuration(leg.duration ?? 0),
                    ),
                  )}
                </ThemeText>
              </View>
            )}
            {isWalkTimeOfSignificance && isWaitTimeOfSignificance && (
              <Dash
                dashGap={4}
                dashLength={4}
                dashThickness={4}
                dashCount={3}
                dashColor={defaultFill}
                style={styles.dash}
              />
            )}
            {isWaitTimeOfSignificance && (
              <View style={styles.waitContainer}>
                <WaitRow
                  onCalculateTime={onCalculateTime}
                  currentLeg={leg}
                  nextLeg={nextLeg!}
                />
              </View>
            )}
          </View>
          <Dash
            dashGap={3}
            dashLength={4}
            dashThickness={4}
            dashCount={3}
            dashColor={defaultFill}
            style={styles.dash}
          />
        </>
      ) : (
        <View style={styles.empty} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 90,
  },
  dash: {
    flexDirection: 'column',
    padding: 0,
    marginLeft: 7,
    marginBottom: 1,
  },
  empty: {
    height: 20,
  },
  walkContainer: {flexDirection: 'row', marginBottom: 5},
  walkText: {marginLeft: 10, fontSize: 14, opacity: 0.6},
  waitContainer: {marginBottom: 4},
});

export default WalkDetail;
