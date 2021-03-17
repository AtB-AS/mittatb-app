import React from 'react';
import {View, Text, Animated} from 'react-native';
import {LocationWithMetadata} from '@atb/favorites/types';
import ScreenHeader from '@atb/components/screen-header';
import {StyleSheet, useTheme} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import DeparturesList from '@atb/components/departure-list/DeparturesList';
import {useDepartureData} from '@atb/screens/Nearby/state';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {DetailsStackParams} from '@atb/screens/TripDetails';

export type QuayDeaparturesNavigationProps = NavigationProp<DetailsStackParams>;
export type QuayDeparturesRouteProp = RouteProp<
  DetailsStackParams,
  'QuayDepartures'
>;

export type QuayDeparturesRouteParams = {
  location: LocationWithMetadata;
};

type RootProps = {
  route: QuayDeparturesRouteProp;
  navigation: QuayDeaparturesNavigationProps;
};

const QuayDepartures: React.FC<RootProps> = ({navigation, route}) => {
  const styles = useNearbyStyles();
  const {theme} = useTheme();
  const {top: paddingTop} = useSafeAreaInsets();

  const {state: departureState} = useDepartureData(route.params.location);

  const {data: departureData} = departureState;

  debugger;

  return (
    <View>
      <View style={[styles.header, {paddingTop}]}>
        <ScreenHeader leftButton={{type: 'back'}} title={'Platform-avganger'} />
      </View>
      <Animated.ScrollView>
        <DeparturesList
          currentLocation={route.params.location}
          departures={departureData}
          isInitialScreen={false}
          showOnlyFavorites={false}
        />
      </Animated.ScrollView>
    </View>
  );
};
export default QuayDepartures;

const useNearbyStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.background.header,
  },
}));

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level0,
  },
  header: {
    backgroundColor: theme.background.header,
  },
  startPlace: {
    marginTop: theme.spacings.large,
  },
  place: {
    marginBottom: -theme.tripLegDetail.decorationLineWidth,
  },
  endPlace: {
    marginBottom: theme.spacings.large,
  },
  row: {
    paddingVertical: theme.spacings.small,
  },
  middleRow: {
    minHeight: 60,
  },
  situationsContainer: {
    marginBottom: theme.spacings.small,
  },
  allGroups: {
    backgroundColor: theme.background.level0,
    marginBottom: theme.spacings.xLarge,
  },
  spinner: {
    paddingTop: theme.spacings.medium,
  },
  scrollView__content: {
    padding: theme.spacings.medium,
    paddingBottom: theme.spacings.large,
  },
}));
