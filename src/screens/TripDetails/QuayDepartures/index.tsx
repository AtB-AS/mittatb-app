import {StopPlace} from '@atb/api/types/trips';
import FullScreenHeader from '@atb/components/screen-header/full-header';
import DeparturesList from '@atb/departure-list/DeparturesList';
import {useDepartureData} from '@atb/screens/Nearby/state';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {TripDetailsScreenProps} from '../types';

export type QuayDeparturesRouteParams = {
  stopPlace: StopPlace;
};

type RootProps = TripDetailsScreenProps<'QuayDepartures'>;

const QuayDepartures: React.FC<RootProps> = ({route}) => {
  const styles = useNearbyStyles();

  const {state: departureState, loadInitialDepartures} = useDepartureData(
    route.params.stopPlace,
  );

  const {data: departureData, isLoading} = departureState;

  return (
    <View style={styles.screen}>
      <FullScreenHeader
        leftButton={{type: 'back'}}
        title={route.params.stopPlace.name}
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
            locationOrStopPlace={route.params.stopPlace}
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
