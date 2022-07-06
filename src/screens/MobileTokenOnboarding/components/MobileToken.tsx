import React from 'react';
import {InspectableTokenScreen} from '@atb/screens/MobileTokenOnboarding/InspectableTokenScreen';
import {NoMobileTokenScreen} from '@atb/screens/MobileTokenOnboarding/NoMobileTokenScreen';
import {findInspectable, isInspectable} from '@atb/mobile-token/utils';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {MobileTokenTabParams} from '@atb/screens/MobileTokenOnboarding';

type MobileTokenProps = {
  navigation: MaterialTopTabNavigationProp<MobileTokenTabParams>;
};
const MobileToken = ({navigation}: MobileTokenProps) => {
  const {remoteTokens, isLoading, isError} = useMobileTokenContextState();

  if (isLoading) return <NoMobileTokenScreen navigation={navigation} />;
  if (isError) return <NoMobileTokenScreen navigation={navigation} />;

  const inspectableToken = findInspectable(remoteTokens);

  if (!inspectableToken) {
    return <NoMobileTokenScreen navigation={navigation} />;
  }

  return (
    <InspectableTokenScreen
      inspectableToken={inspectableToken}
      navigation={navigation}
    />
  );
};

export default MobileToken;
