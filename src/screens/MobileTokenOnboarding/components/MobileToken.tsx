import React from 'react';
import {View} from 'react-native';
import {TCardAsTokenScreen} from '@atb/screens/MobileTokenOnboarding/TCardAsTokenScreen';
import {MobileAsTokenScreen} from '@atb/screens/MobileTokenOnboarding/MobileAsTokenScreen';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
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

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

const MobileToken = ({navigation}: MobileTokenProps) => {
  const styles = useStyles();
  const {remoteTokens, isLoading, isError} = useMobileTokenContextState();

  if (isLoading) return <NoMobileTokenScreen navigation={navigation} />;
  if (isError) return <NoMobileTokenScreen navigation={navigation} />;

  const inspectableToken = remoteTokens?.find((t) => isInspectable(t))!;

  if (isMobileToken(inspectableToken)) {
    return (
      <View style={styles.container}>
        <MobileAsTokenScreen
          inspectableToken={inspectableToken}
          navigation={navigation}
        />
      </View>
    );
  } else if (isTravelCardToken(inspectableToken)) {
    return (
      <View style={styles.container}>
        <TCardAsTokenScreen
          inspectableToken={inspectableToken}
          navigation={navigation}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <NoMobileTokenScreen navigation={navigation} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
}));

export default MobileToken;
