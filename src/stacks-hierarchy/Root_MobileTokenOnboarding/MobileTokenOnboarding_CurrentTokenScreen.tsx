import {useMobileTokenContextState} from '@atb/mobile-token';
import {InspectableTokenInfo} from './components/InspectableTokenInfo';
import {NoTokenInfo} from './components/NoTokenInfo';
import React from 'react';
import {MobileTokenOnboardingScreenProps} from './navigation_types';

type Props =
  MobileTokenOnboardingScreenProps<'MobileTokenOnboarding_CurrentTokenScreen'>;
export const MobileTokenOnboarding_CurrentTokenScreen = ({
  navigation,
}: Props) => {
  const {tokens, mobileTokenStatus} = useMobileTokenContextState();

  const close = () => navigation.pop();

  if (mobileTokenStatus !== 'success') return <NoTokenInfo close={close} />;

  const inspectableToken = tokens.find((t) => t.isInspectable);

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
