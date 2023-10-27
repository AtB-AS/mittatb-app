import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {findInspectable} from '@atb/mobile-token/utils';
import {InspectableTokenInfo} from './components/InspectableTokenInfo';
import {NoTokenInfo} from './components/NoTokenInfo';
import React from 'react';
import {MobileTokenOnboardingScreenProps} from './navigation_types';

type Props =
  MobileTokenOnboardingScreenProps<'MobileTokenOnboarding_CurrentTokenScreen'>;
export const MobileTokenOnboarding_CurrentTokenScreen = ({
  navigation,
}: Props) => {
  const {remoteTokens, isSuccess} = useMobileTokenContextState();

  const close = () => navigation.pop();

  if (!isSuccess) return <NoTokenInfo close={close} />;

  const inspectableToken = findInspectable(remoteTokens);

  if (!inspectableToken) {
    return <NoTokenInfo close={close} />;
  }

  return (
    <InspectableTokenInfo
      inspectableToken={inspectableToken}
      close={close}
      navigateToSelectToken={() =>
        navigation.navigate('MobileTokenOnboarding_SelectTravelTokenScreen')
      }
    />
  );
};
