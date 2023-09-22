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
    if (
      navigation.getState().routeNames[navigation.getState().index] ==
      screenName
    ) {
      giveFocus(focusRef, 100); // Assumed giveFocus is a utility function available in your project.
    }
  }, [navigation.getState().index]);

  return focusRef;
};
