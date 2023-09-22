import {useEffect, useRef} from 'react';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {CompositeNavigationProp} from '@react-navigation/native';

interface UseNavigationFocusProps {
  navigation: CompositeNavigationProp<any, any>;
  screenName: string;
}
export const useNavigationFocus = ({
  navigation,
  screenName,
}: UseNavigationFocusProps) => {
  const focusRef = useRef(null);

  useEffect(() => {
    const {index, routeNames} = navigation.getState();

    if (routeNames.length >= index && routeNames[index] === screenName) {
      giveFocus(focusRef, 100);
    }
  }, [navigation]);

  return focusRef;
};
