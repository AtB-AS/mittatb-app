import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import {useAuthState} from '@atb/auth';
import {useAppState} from '@atb/AppContext';
import {shouldOnboardMobileToken} from '@atb/api/utils';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {RootNavigationProps} from '@atb/stacks-hierarchy';

export const useGoToMobileTokenOnboardingWhenNecessary = () => {
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {authenticationType} = useAuthState();
  const {mobileTokenOnboarded} = useAppState();
  const shouldOnboard = shouldOnboardMobileToken(
    hasEnabledMobileToken,
    authenticationType,
    mobileTokenOnboarded,
  );
  const navigation = useNavigation<RootNavigationProps>();

  useEffect(() => {
    if (shouldOnboard) {
      navigation.navigate('Root_MobileTokenOnboardingStack');
    }
  }, [shouldOnboard]);
};
