import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Dash from 'react-native-dash';
import {formatToClock, missingRealtimePrefix} from '../../../utils/date';
import {Dot} from '../../../assets/svg/icons/other';
import LocationRow from '../LocationRow';
import {LegDetailProps, DetailScreenNavigationProp} from './index_old';
import {useNavigation} from '@react-navigation/native';
import TransportationIcon from '../../../components/transportation-icon';
import {
  getLineName,
  getQuayNameFromStartLeg,
  getQuayNameFromStopLeg,
} from '../../../utils/transportation-names';
import {getAimedTimeIfLargeDifference} from '../utils';
import WaitRow from './WaitRow';
import transportationColor, {
  defaultFill,
} from '../../../utils/transportation-color';
import SituationRow from '../SituationRow';
import {useLayout} from '../../../utils/use-layout';
import ThemeText from '../../../components/text';
import {StyleSheet} from '../../../theme';
import {useTranslation} from '../../../translations';
import dictionary from '../../../translations/dictionary';

const TransportDetail: React.FC<LegDetailProps> = ({
  leg,
  nextLeg,
  isIntermediateTravelLeg,
  onCalculateTime,
  showFrom,
  parentSituations = [],
}) => {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const showWaitTime = isIntermediateTravelLeg && Boolean(nextLeg);
  const {color: fill} = transportationColor(leg.mode, leg.line?.publicCode);

  const timeString = (time: string) => {
    if (!leg.realtime) {
      return missingRealtimePrefix + formatToClock(time);
    }
    return formatToClock(time);
  };

  const {height: fromHeight, onLayout: onFromLayout} = useLayout();
  const {height: toHeight, onLayout: onToLayout} = useLayout();
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <View style={{marginTop: -6}}>
      <TouchableOpacity
        style={{overflow: 'visible'}}
        onPress={() =>
          navigation.navigate('DepartureDetails', {
            title: getLineName(leg),
            serviceJourneyId: leg.serviceJourney.id,
            date: leg.expectedStartTime,
            fromQuayId: leg.fromPlace.quay?.id,
            toQuayId: leg.toPlace.quay?.id,
            isBack: true,
          })
        }
      >
        <View
          style={[
            styles.dashContainer,
            {paddingTop: fromHeight / 2, paddingBottom: toHeight / 2},
          ]}
        >
          <Dash
            dashGap={0}
            dashThickness={8}
            dashLength={8}
            dashColor={fill}
            style={styles.dash}
          />
        </View>
        {showFrom && (
          <LocationRow
            icon={
              <TransportationIcon
                mode={leg.mode}
                publicCode={leg.line?.publicCode}
              />
            }
            label={
              getQuayNameFromStartLeg(leg) ??
              t(dictionary.travel.quay.defaultName)
            }
            time={timeString(leg.expectedStartTime)}
            aimedTime={
              leg.realtime
                ? getAimedTimeIfLargeDifference(leg.fromEstimatedCall)
                : undefined
            }
            timeStyle={{fontWeight: 'bold', fontSize: 16}}
            textStyle={styles.textStyle}
            dashThroughIcon={true}
            onLayout={onFromLayout}
          />
        )}
        <ThemeText style={styles.lineName}>{getLineName(leg)}</ThemeText>

        <SituationRow
          situations={leg.situations}
          parentSituations={parentSituations}
        />

        <LocationRow
          icon={<Dot fill={fill} />}
          label={
            getQuayNameFromStopLeg(leg) ?? t(dictionary.travel.quay.defaultName)
          }
          time={timeString(leg.expectedEndTime)}
          aimedTime={
            leg.realtime
              ? getAimedTimeIfLargeDifference(leg.toEstimatedCall)
              : undefined
          }
          textStyle={styles.textStyle}
          dashThroughIcon={true}
          onLayout={onToLayout}
        />
      </TouchableOpacity>
      {showWaitTime && (
        <View style={styles.waitDashContainer}>
          <Dash
            dashGap={4}
            dashLength={4}
            dashThickness={4}
            dashCount={3}
            dashColor={defaultFill}
            style={styles.waitDash}
          />
          <View style={styles.waitContainer}>
            <WaitRow
              onCalculateTime={onCalculateTime}
              currentLeg={leg}
              nextLeg={nextLeg!}
            />
          </View>
          <Dash
            dashGap={4}
            dashLength={4}
            dashThickness={4}
            dashCount={3}
            dashColor={defaultFill}
            style={styles.waitDash}
          />
        </View>
      )}
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  textStyle: {
    ...theme.text.lead,
  },
  lineName: {
    marginLeft: 120,
    ...theme.text.paragraphHeadline,
  },
  dashContainer: {
    marginLeft: 95,
    position: 'absolute',
    height: '100%',
    paddingVertical: theme.spacings.medium,
  },
  dash: {
    flexDirection: 'column',
    height: '100%',
  },
  waitDashContainer: {
    marginLeft: 90,
  },
  waitContainer: {
    marginBottom: 5,
  },
  waitDash: {
    flexDirection: 'column',
    padding: 0,
    marginLeft: 7,
    marginBottom: 1,
  },
}));

export default TransportDetail;
