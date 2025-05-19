import {RouteProp, useRoute} from '@react-navigation/native';
import {Location} from '@atb/modules/favorites';
import {SelectableLocationType} from './types';
import React, {useRef} from 'react';

export function useLocationSearchValue<T extends RouteProp<any, any>>(
  callerRouteParam: keyof T['params'],
  defaultLocation?: Location,
): SelectableLocationType | undefined {
  const route = useRoute<T>();
  const firstTimeRef = useRef(true);
  const [location, setLocation] = React.useState<
    SelectableLocationType | undefined
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params?.[callerRouteParam]]);

  return location;
}

export function useOnlySingleLocation<T extends RouteProp<any, any>>(
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
