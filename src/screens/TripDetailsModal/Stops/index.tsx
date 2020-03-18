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
import ScreenHeader from '../../../ScreenHeader';
import {getLineName} from '../utils';
import {ScrollView} from 'react-native-gesture-handler';
import Dash from 'react-native-dash';

export type StopRouteParams = {
  leg: Leg;
};

export type DetailScreenRouteProp = RouteProp<DetailsModalStackParams, 'Stops'>;

type DetailScreenNavigationProp = NavigationProp<RootStackParamList>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailScreenNavigationProp;
};

export default function Stops({navigation, route}: Props) {
  const {leg} = route.params;
  const styles = useStopsStyle();

  const numElements = leg.intermediateEstimatedCalls.length;
  return (
    <View style={styles.container}>
      <ScreenHeader onClose={() => navigation.goBack()}>
        {getLineName(leg)}
      </ScreenHeader>

      <ScrollView style={styles.scrollView}>
        <Dash
          dashGap={4}
          dashThickness={8}
          dashLength={8}
          dashColor={colors.primary.green}
          style={styles.dash}
          dashStyle={{borderRadius: 50}}
        />

        {leg.intermediateEstimatedCalls.map((call, i) => (
          <LocationRow
            icon={<DotIcon fill={colors.primary.green} />}
            rowStyle={[
              styles.item,
              i === numElements - 1 ? styles.itemNoMargin : undefined,
            ]}
            key={call.quay.id}
            location={call.quay.name}
            time={formatToClock(
              call.expectedDepartureTime ?? call.aimedDepartureTime,
            )}
            textStyle={styles.textStyle}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const useStopsStyle = StyleSheet.createThemeHook(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.modal_Level2,
  },
  dash: {
    marginLeft: 87,
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
  },
  item: {
    marginBottom: 28,
  },
  itemNoMargin: {
    marginBottom: 0,
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  textStyle: {
    fontSize: 16,
  },
}));
