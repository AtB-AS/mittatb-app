import {RouteProp} from '@react-navigation/native';
import {Location} from '@atb/modules/favorites';
import {SelectableLocationType} from './types';
import {useEffect, useRef, useState} from 'react';

export function useLocationSearchValue<T extends RouteProp<any, any>>(
  route: T,
  callerRouteParam: keyof T['params'],
  defaultLocation?: Location,
): SelectableLocationType | undefined {
  const firstTimeRef = useRef(true);
  const [location, setLocation] = useState<SelectableLocationType | undefined>(
    defaultLocation,
  );

  const param = route.params?.[callerRouteParam];
  useEffect(() => {
    if (firstTimeRef.current && param === undefined) {
      firstTimeRef.current = false;
      return;
    }
    setLocation(param);
  }, [param]);

  return location;
}

export function useOnlySingleLocation<T extends RouteProp<any, any>>(
  route: T,
  callerRouteParam: keyof T['params'],
  defaultLocation?: Location,
): Location | undefined {
  const selectable = useLocationSearchValue(
    route,
    callerRouteParam,
    defaultLocation,
  );

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
