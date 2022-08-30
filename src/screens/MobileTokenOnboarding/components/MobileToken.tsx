import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {findInspectable} from '@atb/mobile-token/utils';
import {InspectableTokenScreen} from '@atb/screens/MobileTokenOnboarding/InspectableTokenScreen';
import {NoMobileTokenScreen} from '@atb/screens/MobileTokenOnboarding/NoMobileTokenScreen';
import React from 'react';
import {MobileTokenOnboardingScreenProps} from '../types';

export type MobileTokenProps = MobileTokenOnboardingScreenProps<'MobileToken'>;
const MobileToken = ({navigation}: MobileTokenProps) => {
  const {remoteTokens, isLoading, isError} = useMobileTokenContextState();

  const close = () => navigation.popToTop();

  if (isLoading) return <NoMobileTokenScreen close={close} />;
  if (isError) return <NoMobileTokenScreen close={close} />;

  const inspectableToken = findInspectable(remoteTokens);

  if (!inspectableToken) {
    return <NoMobileTokenScreen close={close} />;
  }

  return (
    <InspectableTokenScreen
      inspectableToken={inspectableToken}
      close={close}
      navigateToSelectToken={() => navigation.navigate('SelectTravelTokenRoot')}
    />
  );
};

export default MobileToken;
