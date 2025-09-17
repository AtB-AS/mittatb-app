import {useNavigation} from '@react-navigation/native';

export const useNavigationSafe = () => {
  try {
    return useNavigation();
  } catch {
    /*
    Navigation is not available as the current context is not inside a screen in
    a navigator
     */
    return undefined;
  }
};
