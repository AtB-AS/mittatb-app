import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {findInspectable} from '@atb/mobile-token/utils';
import {InspectableTokenInfo} from './components/InspectableTokenInfo';
import {NoTokenInfo} from './components/NoTokenInfo';
import React from 'react';
import {MobileTokenWithoutTravelcardOnboardingScreenProps} from './navigation_types';

type Props =
  MobileTokenWithoutTravelcardOnboardingScreenProps<'MobileTokenWithoutTravelcardOnboarding_CurrentTokenScreen'>;
export const MobileTokenWithoutTravelcardOnboarding_CurrentTokenScreen = ({
  navigation,
}: Props) => {
  const {remoteTokens, isLoading, isError} = useMobileTokenContextState();

  const close = () => navigation.pop();

  if (isLoading) return <NoTokenInfo close={close} />;
  if (isError) return <NoTokenInfo close={close} />;

  const inspectableToken = findInspectable(remoteTokens);

  if (!inspectableToken) {
    return <NoTokenInfo close={close} />;
  }

  return (
    <InspectableTokenInfo
      inspectableToken={inspectableToken}
      close={close}
      navigateToSelectToken={() =>
        navigation.navigate(
          'MobileTokenWithoutTravelcardOnboarding_SelectTravelTokenScreen',
        )
      }
    />
  );
};
