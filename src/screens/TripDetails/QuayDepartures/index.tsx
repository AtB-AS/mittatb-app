import React from 'react';
import {View, RefreshControl, ScrollView} from 'react-native';
import {GeoLocation, Location, SearchLocation} from '@atb/favorites/types';
import {StyleSheet} from '@atb/theme';
import DeparturesList from '@atb/departure-list/DeparturesList';
import {useDepartureData} from '@atb/screens/Nearby/state';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {DetailsStackParams} from '@atb/screens/TripDetails';
import FullScreenHeader from '@atb/components/screen-header/full-header';

export type QuayDeaparturesNavigationProps = NavigationProp<DetailsStackParams>;
export type QuayDeparturesRouteProp = RouteProp<
  DetailsStackParams,
  'QuayDepartures'
>;

export type QuayDeparturesRouteParams = {
  location: SearchLocation;
};

type RootProps = {
  route: QuayDeparturesRouteProp;
  navigation: QuayDeaparturesNavigationProps;
};

const QuayDepartures: React.FC<RootProps> = ({route}) => {
  const styles = useNearbyStyles();

  const {state: departureState, loadInitialDepartures} = useDepartureData(
    route.params.location,
  );

  const {data: departureData, isLoading} = departureState;

  return (
    <View style={styles.screen}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        title={route.params.location.name}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={!departureData}
            onRefresh={loadInitialDepartures}
          />
        }
      >
        <View style={styles.scrollContainer}>
          <DeparturesList
            currentLocation={route.params.location}
            departures={departureData}
            isInitialScreen={false}
            showOnlyFavorites={false}
            isLoading={isLoading}
            disableCollapsing={true}
            searchDate={new Date().toISOString()}
          />
        </View>
      </ScrollView>
    </View>
  );
};
export default QuayDepartures;

const useNearbyStyles = StyleSheet.createThemeHook((theme) => ({
  screen: {
    backgroundColor: theme.static.background.background_1.background,
    flexGrow: 1,
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: theme.spacings.large,
  },
}));
