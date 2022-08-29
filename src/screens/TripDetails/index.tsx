import PlaceScreen from '@atb/screens/Departures/PlaceScreen';
import QuayDepartures from '@atb/screens/TripDetails/QuayDepartures';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {DeparturesScreenProps} from '../Departures/types';
import DepartureDetails from './DepartureDetails';
import Details from './Details';
import {TravelDetailsMap} from './Map';
import {DetailsStackParams} from './types';

const Stack = createStackNavigator<DetailsStackParams>();

type TripDetailsRootProps = DeparturesScreenProps<'TripDetails'>;

function TripDetailsRoot({}: TripDetailsRootProps) {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Details" component={Details} />
      <Stack.Screen
        name="DetailsMap"
        component={TravelDetailsMap}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <Stack.Screen name="QuayDepartures" component={QuayDepartures} />
      <Stack.Screen name="DepartureDetails" component={DepartureDetails} />
      <Stack.Screen name="PlaceScreen" component={PlaceScreen} />
    </Stack.Navigator>
  );
}

export default TripDetailsRoot;
