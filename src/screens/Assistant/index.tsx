import {createStackNavigator} from '@react-navigation/stack';
import {LocationWithMetadata} from '../../favorites/types';
import {DepartureDetailsRouteParams} from '../TripDetails/DepartureDetails';
import {DetailsRouteParams} from '../TripDetails/Details';

export type AssistantParams = {
  Assistant: {
    fromLocation: LocationWithMetadata;
    toLocation: LocationWithMetadata;
  };
  Details: DetailsRouteParams;
  DepartureDetails: DepartureDetailsRouteParams;
};

const Stack = createStackNavigator<AssistantParams>();

const AssistantRoot = () => {
  return (
    <Stack.Navigator
      initialRouteName="Assistant"
      headerMode="none"
    ></Stack.Navigator>
  );
};
