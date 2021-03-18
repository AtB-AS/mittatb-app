import {
  CompositeNavigationProp,
  ParamListBase,
  RouteProp,
  useRoute,
} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import React, {useRef} from 'react';
import {Location} from '../favorites/types';
import {RootStackParamList} from '../navigation';
import LocationSearch, {
  RouteParams as LocationSearchRouteParams,
} from './LocationSearch';
import MapSelection, {
  RouteParams as MapSelectionRouteParams,
} from './map-selection';
import {SelectableLocationData} from './types';

export type LocationSearchStackParams = {
  LocationSearch: LocationSearchRouteParams;
  MapSelection: MapSelectionRouteParams;
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
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default LocationSearchRoot;

export function useLocationSearchValue<
  T extends RouteProp<any, any> & {params: ParamListBase}
>(
  callerRouteParam: keyof T['params'],
  defaultLocation?: Location,
): SelectableLocationData | undefined {
  const route = useRoute<T>();
  const firstTimeRef = useRef(true);
  const [location, setLocation] = React.useState<
    SelectableLocationData | undefined
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
