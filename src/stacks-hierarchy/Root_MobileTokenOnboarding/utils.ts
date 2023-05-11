import {useHasEnabledMobileToken} from '@atb/mobile-token/MobileTokenContext';
import {useAuthState} from '@atb/auth';
import {useAppState} from '@atb/AppContext';
import {
  shouldOnboardMobileToken,
  shouldOnboardMobileTokenWithoutTravelcard,
} from '@atb/api/utils';
import {useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

export const useGoToMobileTokenOnboardingWhenNecessary = () => {
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {authenticationType} = useAuthState();
  const {mobileTokenOnboarded, mobileTokenWithoutTravelcardOnboarded} =
    useAppState();
  const {disable_travelcard} = useRemoteConfig();
  const navigation = useNavigation<RootNavigationProps>();

  const shouldOnboard = shouldOnboardMobileToken(
    hasEnabledMobileToken,
    authenticationType,
    mobileTokenOnboarded,
    disable_travelcard,
  );
  const shouldOnboardWithoutTravelcard =
    shouldOnboardMobileTokenWithoutTravelcard(
      hasEnabledMobileToken,
      authenticationType,
      mobileTokenWithoutTravelcardOnboarded,
      disable_travelcard,
    );

  useEffect(() => {
    if (shouldOnboardWithoutTravelcard) {
      navigation.navigate('Root_MobileTokenWithoutTravelcardOnboardingStack');
    } else if (shouldOnboard) {
      navigation.navigate('Root_MobileTokenOnboardingStack');
    }
  }, [shouldOnboardWithoutTravelcard, shouldOnboard]);
};
