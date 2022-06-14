import React from 'react';
import {View} from 'react-native';
import {TCardAsMobileToken} from '@atb/login/travel-document-onboarding/TCardAsMobileToken';
import {PhoneAsMobileToken} from '@atb/login/travel-document-onboarding/PhoneAsMobileToken';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {NoMobileToken} from '@atb/login/travel-document-onboarding/NoMobileToken';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

const MobileToken = () => {
  const styles = useStyles();
  const {travelTokens} = useMobileTokenContextState();
  const inspectableToken = travelTokens?.find((t) => t.inspectable)!;
  switch (inspectableToken.type) {
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
