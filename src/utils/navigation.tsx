import analytics from '@react-native-firebase/analytics';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';

const HOME_TAB_NAME = 'Assistant';

export const useNavigateHome = () => {
  const navigation = useNavigation();
  return useCallback(() => {
    analytics().logEvent('click_logo');
    navigation.navigate(HOME_TAB_NAME);
  }, [navigation]);
};
