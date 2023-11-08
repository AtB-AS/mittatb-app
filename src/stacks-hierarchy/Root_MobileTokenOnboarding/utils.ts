import {useAuthState} from '@atb/auth';
import {useAppState} from '@atb/AppContext';
import {shouldOnboardMobileToken} from '@atb/api/utils';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useEffect} from 'react';
import {RootNavigationProps} from '@atb/stacks-hierarchy';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {InteractionManager} from 'react-native';

export const useGoToMobileTokenOnboardingWhenNecessary = () => {
  const {authenticationType} = useAuthState();
  const {mobileTokenOnboarded, mobileTokenWithoutTravelcardOnboarded} =
    useAppState();
  const {disable_travelcard} = useRemoteConfig();
  const navigation = useNavigation<RootNavigationProps>();

  const shouldOnboard = shouldOnboardMobileToken(
    authenticationType,
    mobileTokenOnboarded,
    mobileTokenWithoutTravelcardOnboarded,
    disable_travelcard,
  );

  const isFocused = useIsFocused();
  useEffect(() => {
    if (shouldOnboard && isFocused) {
      InteractionManager.runAfterInteractions(() =>
        navigation.navigate('Root_MobileTokenOnboardingStack'),
      );
    }
  }, [shouldOnboard, isFocused]);
};
