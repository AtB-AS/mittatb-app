import React from 'react';
import {TCardAsTokenScreen} from '@atb/screens/MobileTokenOnboarding/TCardAsTokenScreen';
import {MobileAsTokenScreen} from '@atb/screens/MobileTokenOnboarding/MobileAsTokenScreen';
import {NoMobileTokenScreen} from '@atb/screens/MobileTokenOnboarding/NoMobileTokenScreen';
import {
  isInspectable,
  isMobileToken,
  isTravelCardToken,
} from '@atb/mobile-token/utils';
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

  const inspectableToken = remoteTokens?.find((t) => isInspectable(t))!;

  if (isMobileToken(inspectableToken)) {
    return (
      <MobileAsTokenScreen
        inspectableToken={inspectableToken}
        navigation={navigation}
      />
    );
  } else if (isTravelCardToken(inspectableToken)) {
    return (
      <TCardAsTokenScreen
        inspectableToken={inspectableToken}
        navigation={navigation}
      />
    );
  }
  return <NoMobileTokenScreen navigation={navigation} />;
};

export default MobileToken;
