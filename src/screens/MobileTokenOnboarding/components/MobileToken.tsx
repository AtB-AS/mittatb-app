import React, {useEffect} from 'react';
import {InspectableTokenScreen} from '@atb/screens/MobileTokenOnboarding/InspectableTokenScreen';
import {NoMobileTokenScreen} from '@atb/screens/MobileTokenOnboarding/NoMobileTokenScreen';
import {findInspectable} from '@atb/mobile-token/utils';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import {MobileTokenTabParams} from '@atb/screens/MobileTokenOnboarding';
import {CompositeNavigationProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '@atb/navigation';
import {useAppState} from '@atb/AppContext';

type NavigationProp = CompositeNavigationProp<
  MaterialTopTabNavigationProp<MobileTokenTabParams>,
  StackNavigationProp<RootStackParamList, 'MobileTokenOnboarding'>
>;

type MobileTokenProps = {
  navigation: NavigationProp;
};
const MobileToken = ({navigation}: MobileTokenProps) => {
  const {remoteTokens, isLoading, isError} = useMobileTokenContextState();
  const {completeMobileTokenOnboarding} = useAppState();

  useEffect(() => {
    completeMobileTokenOnboarding();
  }, [completeMobileTokenOnboarding]);

  const close = () => navigation.pop();

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
