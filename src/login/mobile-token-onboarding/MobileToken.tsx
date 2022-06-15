import React from 'react';
import {View} from 'react-native';
import {TCardAsMobileToken} from '@atb/login/mobile-token-onboarding/TCardAsMobileToken';
import {PhoneAsMobileToken} from '@atb/login/mobile-token-onboarding/PhoneAsMobileToken';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {NoMobileToken} from '@atb/login/mobile-token-onboarding/NoMobileToken';
import {TravelToken} from '@atb/mobile-token/types';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

const MobileToken = ({inspectableToken}: {inspectableToken: TravelToken}) => {
  const styles = useStyles();
  switch (inspectableToken?.type) {
    case 'travelCard':
      return (
        <View style={styles.container}>
          <TCardAsMobileToken inspectableToken={inspectableToken} />
        </View>
      );
    case 'mobile':
      return (
        <View style={styles.container}>
          <PhoneAsMobileToken inspectableToken={inspectableToken} />
        </View>
      );
    default:
      return (
        <View style={styles.container}>
          <NoMobileToken />
        </View>
      );
  }
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.static.background[themeColor].background,
  },
}));

export default MobileToken;
