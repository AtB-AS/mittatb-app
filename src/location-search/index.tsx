import {ParamListBase, RouteProp, useRoute} from '@react-navigation/native';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {useRef} from 'react';
import {Location} from '../favorites/types';
import LocationSearch from './LocationSearch';
import MapSelection from './map-selection';
import {
  LocationSearchRootProps,
  LocationSearchStackParams,
  SelectableLocationData,
} from './types';

const Stack = createStackNavigator<LocationSearchStackParams>();

const LocationSearchRoot = ({route}: LocationSearchRootProps) => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="LocationSearchMain"
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
  T extends RouteProp<any, any> & {params: ParamListBase},
>(
  callerRouteParam: keyof T['params'],
  defaultLocation?: Location,
): SelectableLocationData | undefined {
  const route = useRoute<T>();
  const firstTimeRef = useRef(true);
  const [location, setLocation] = React.useState<
    SelectableLocationData | undefined
  >(defaultLocation);

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

export function useOnlySingleLocation<
  T extends RouteProp<any, any> & {params: ParamListBase},
>(
  callerRouteParam: keyof T['params'],
  defaultLocation?: Location,
): Location | undefined {
  const selectable = useLocationSearchValue(callerRouteParam, defaultLocation);

  if (!selectable) return undefined;
  switch (selectable.resultType) {
    case 'journey': {
      return {
        ...selectable.journeyData[0],
        resultType: 'search',
      };
    }
  }
  return selectable;
}
