import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  StatusBar,
  View,
} from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import EventSource from './EventSource';

type LatLngExpression = [number, number];

type Vehicle = {
  vehicleRef: string;
  routeRef: string;
  lineRef: string;
  publishedLineName: string;
  originName: string;
  destinationName: string;
  delay: string;
  location: LatLngExpression;
};

type Action = {
  type: 'vehicle_update';
  payload: Vehicle;
};

type State = {
  vehicles: Record<string, Vehicle>;
};

const initialState: State = {
  vehicles: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'vehicle_update': {
      return {
        vehicles: {
          ...state.vehicles,
          [action.payload.vehicleRef]: action.payload,
        },
      };
    }
  }
}

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  React.useEffect(() => {
    const es = new EventSource(
      'https://atb-entur.herokuapp.com/sse?stream=siri-vm',
    );
    const listener = (m: any) => {
      const journey = JSON.parse(m.data).MonitoredVehicleJourney;
      const {latitude, longitude} = journey.vehicleLocation;
      if (!latitude || !longitude) return;
      dispatch({
        type: 'vehicle_update',
        payload: {
          vehicleRef: journey.vehicleRef,
          routeRef: journey.routeRef,
          lineRef: journey.lineRef,
          publishedLineName: journey.publishedLineName,
          delay: journey.delay,
          originName: journey.originName,
          destinationName: journey.destinationName,
          location: [latitude, longitude],
        },
      });
    };

    es.addEventListener('message', listener);
    return () => {
      es.removeEventListener('message', listener);
      es.close();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <MapView
            style={{height: 800}}
            initialRegion={{
              latitude: 63.4305,
              longitude: 10.3951,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            {Object.entries(state.vehicles).map(([k, v]) => (
              <Marker
                coordinate={{latitude: v.location[0], longitude: v.location[1]}}
                key={k}>
                <Callout>
                  <View style={{flex: 1, flexWrap: 'wrap'}}>
                    <Text>{JSON.stringify(v, null, 2)}}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
});

export default App;
