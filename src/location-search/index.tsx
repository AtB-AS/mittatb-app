import React, {useRef} from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import LocationSearch, {
  RouteParams as LocationSearchRouteParams,
} from './LocationSearch';
import MapSelection from './map-selection';
import {
  CompositeNavigationProp,
  ParamListBase,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {RootStackParamList} from '../navigation';
import {Location} from '../favorites/types';

export type LocationSearchStackParams = {
  LocationSearch: LocationSearchRouteParams;
  MapSelection: undefined;
};

export type LocationSearchNavigationProp = CompositeNavigationProp<
  StackNavigationProp<LocationSearchStackParams>,
  StackNavigationProp<RootStackParamList>
>;

export type RouteParams = LocationSearchRouteParams;

const Stack = createStackNavigator<LocationSearchStackParams>();

type LocationSearchRootProps = {
  route: {params: RouteParams};
};

const LocationSearchRoot = ({route}: LocationSearchRootProps) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="LocationSearch"
        component={LocationSearch}
        initialParams={route.params}
      />
      <Stack.Screen
        name="MapSelection"
        component={MapSelection}
        options={{
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default LocationSearchRoot;

export type LocationResultType = 'search' | 'geolocation' | 'favorite';

export type LocationWithSearchMetadata = Location &
  (
    | {
        resultType: 'search' | 'geolocation';
      }
    | {resultType: 'favorite'; favoriteId: string}
  );

export function useLocationSearchValue<
  T extends RouteProp<any, any> & {params: ParamListBase}
>(
  callerRouteParam: keyof T['params'],
  defaultLocation?: Location,
): LocationWithSearchMetadata | undefined {
  const route = useRoute<T>();
  const firstTimeRef = useRef(true);
  const [location, setLocation] = React.useState<
    LocationWithSearchMetadata | undefined
  >(defaultLocation && {...defaultLocation, resultType: 'search'});

  React.useEffect(() => {
    if (
      firstTimeRef.current &&
      route.params?.[callerRouteParam] === undefined
    ) {
      firstTimeRef.current = false;
      return;
    }
    setLocation(route.params?.[callerRouteParam]);
  }, [route.params?.[callerRouteParam]]);

  return location;
}
