import React from 'react';
import {View, Animated, RefreshControl} from 'react-native';
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

const QuayDepartures: React.FC<RootProps> = ({route}) => {
  const styles = useNearbyStyles();
  const {theme} = useTheme();
  const {top: paddingTop} = useSafeAreaInsets();

  const {state: departureState, refresh} = useDepartureData(
    route.params.location,
  );

  const {data: departureData, isLoading} = departureState;

  return (
    <View style={styles.screen}>
      <View style={[styles.header, {paddingTop}]}>
        <ScreenHeader
          leftButton={{type: 'back'}}
          title={route.params.location.name}
        />
      </View>
      <Animated.ScrollView
        refreshControl={
          <RefreshControl refreshing={!departureData} onRefresh={refresh} />
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
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};
export default QuayDepartures;

const useNearbyStyles = StyleSheet.createThemeHook((theme) => ({
  header: {
    backgroundColor: theme.background.header,
    zIndex: 2,
  },
  spinner: {
    backgroundColor: theme.background.level2,
    width: 100,
    height: 100,
    borderRadius: theme.border.radius.circle,
    border: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '20%',
  },
  screen: {
    backgroundColor: theme.background.level1,
    flexGrow: 1,
  },
  scrollContainer: {
    marginTop: theme.spacings.large,
  },
}));
