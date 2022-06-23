import React from 'react';
import {View} from 'react-native';
import {TCardAsToken} from '@atb/login/mobile-token-onboarding/TCardAsToken';
import {MobileAsToken} from '@atb/login/mobile-token-onboarding/MobileAsToken';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {NoMobileToken} from '@atb/login/mobile-token-onboarding/NoMobileToken';
import {RemoteToken} from '@atb/mobile-token/types';
import {isMobileToken, isTravelCardToken} from '@atb/mobile-token/utils';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

const MobileToken = ({inspectableToken}: {inspectableToken: RemoteToken}) => {
  const styles = useStyles();
  if (isMobileToken(inspectableToken)) {
    return (
      <View style={styles.container}>
        <MobileAsToken inspectableToken={inspectableToken} />
      </View>
    );
  } else if (isTravelCardToken(inspectableToken)) {
    return (
      <View style={styles.container}>
        <TCardAsToken inspectableToken={inspectableToken} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <NoMobileToken />
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
