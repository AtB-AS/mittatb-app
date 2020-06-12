import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, Linking} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PRIVACY_POLICY_URL} from 'react-native-dotenv';
import colors from '../../theme/colors';
import {useGeolocationState} from '../../GeolocationContext';
import {useAppState} from '../../AppContext';
import {StyleSheet} from '../../theme';
import {TestPilotFigure} from '../../assets/svg/illustrations';

const Onboarding: React.FC = () => {
  const {completeOnboarding} = useAppState();
  const {status, requestPermission} = useGeolocationState();
  const [requestedOnce, setRequestedOnce] = useState(false);

  const styles = useStyles();

  useEffect(() => {
    if (requestedOnce && status) {
      completeOnboarding();
    }
  }, [status, requestedOnce]);

  async function onRequestPermission() {
    if (status !== 'granted')
      await requestPermission({useSettingsFallback: true});
    setRequestedOnce(true);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Velkommen som testpilot! </Text>
          <TestPilotFigure width={48} style={styles.figure} />
          <Text style={styles.description}>
            Nå kan du begynne å teste appen for å finne reiser og se busstrafikk
            i sanntid fra telefonen din!
          </Text>
          <Text style={styles.subtitle}>
            Bedre opplevelse med posisjonsdeling
          </Text>
          <Text style={styles.description}>
            Deling av posisjon mens du bruker appen vil gi en mye bedre
            opplevelse og enklere bruk. Vi anbefaler derfor at du tillater
            dette. Du kan når som helst slutte å dele posisjon.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onRequestPermission}>
            <Text style={styles.buttonText}>Fortsett</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(PRIVACY_POLICY_URL ?? 'https://www.atb.no')
            }
          >
            <Text style={styles.privacyPolicy}>
              Les vår personvernerklæring
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level1,
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 26,
    textAlign: 'center',
    color: theme.text.primary,
    marginTop: 24,
  },
  figure: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.text.primary,
    marginTop: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.text.primary,
    marginVertical: 12,
  },
  privacyPolicy: {
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: theme.text.primary,
    marginTop: 24,
  },
  svgContainer: {
    width: '100%',
    maxHeight: 300,
    zIndex: -1,
  },
  svg: {
    opacity: 0.2,
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    padding: 24,
  },
  button: {
    backgroundColor: colors.secondary.cyan,
    width: '100%',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: theme.text.primary,
  },
}));

export default Onboarding;
