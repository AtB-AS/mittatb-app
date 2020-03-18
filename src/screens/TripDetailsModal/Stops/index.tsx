import React from 'react';
import {Leg} from '../../../sdk';
import {DetailsModalStackParams} from '..';
import {RouteProp, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../../../navigation';
import {View} from 'react-native';
import DotIcon from '../../../assets/svg/DotIcon';
import {formatToClock} from '../../../utils/date';
import colors from '../../../theme/colors';
import LocationRow from '../LocationRow';
import {StyleSheet} from '../../../theme';

export type StopRouteParams = {
  leg: Leg;
};

export type DetailScreenRouteProp = RouteProp<DetailsModalStackParams, 'Stops'>;

type DetailScreenNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};

export default function Stops({route}: Props) {
  const {leg} = route.params;
  return (
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
  );
}

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
