import React from 'react';
import {View} from 'react-native';
import {TCardAsTravelDocument} from '@atb/login/travel-document-onboarding/TCardAsTravelDocument';
import {PhoneAsTravelDocument} from '@atb/login/travel-document-onboarding/PhoneAsTravelDocument';
import {StyleSheet} from '@atb/theme';
import {StaticColorByType} from '@atb/theme/colors';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import {NoTravelDocument} from '@atb/login/travel-document-onboarding/NoTravelDocument';

const themeColor: StaticColorByType<'background'> = 'background_accent_0';

const TravelDocument = () => {
  const styles = useStyles();
  const {travelTokens} = useMobileTokenContextState();
  const inspectableToken = travelTokens?.find((t) => t.inspectable)!;
  switch (inspectableToken.type) {
    case 'travelCard':
      return (
        <View style={styles.container}>
          <TCardAsTravelDocument inspectableToken={inspectableToken} />
        </View>
      );
    case 'mobile':
      return (
        <View style={styles.container}>
          <PhoneAsTravelDocument inspectableToken={inspectableToken} />
        </View>
      );
    default:
      return (
        <View style={styles.container}>
          <NoTravelDocument />
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

export default TravelDocument;
