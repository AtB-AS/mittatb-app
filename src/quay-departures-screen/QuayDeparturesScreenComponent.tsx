import {StopPlace} from '@atb/api/types/trips';
import {FullScreenHeader} from '@atb/components/screen-header';
import DeparturesList from '@atb/departure-list/DeparturesList';
import {useDepartureData} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_NearbyStack';
import {StyleSheet} from '@atb/theme';
import React from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {ServiceJourneyDeparture} from '@atb/travel-details-screens/types';

export type QuayDeparturesScreenParams = {
  stopPlace: StopPlace;
};

type Props = QuayDeparturesScreenParams & {
  onPressDeparture: (items: ServiceJourneyDeparture[], index: number) => void;
};

export const QuayDeparturesScreenComponent = ({
  stopPlace,
  onPressDeparture,
}: Props) => {
  const styles = useStyles();

  const {state: departureState, loadInitialDepartures} =
    useDepartureData(stopPlace);

  const {data: departureData, isLoading} = departureState;

  return (
    <View style={styles.screen}>
      <FullScreenHeader leftButton={{type: 'back'}} title={stopPlace.name} />
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
            locationOrStopPlace={stopPlace}
            departures={departureData}
            isInitialScreen={false}
            showOnlyFavorites={false}
            isLoading={isLoading}
            disableCollapsing={true}
            searchDate={new Date().toISOString()}
            onPressDeparture={onPressDeparture}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  screen: {
    backgroundColor: theme.static.background.background_1.background,
    flexGrow: 1,
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: theme.spacings.large,
  },
}));
