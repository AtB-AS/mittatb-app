import React, {useEffect, useState} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import {PRIVACY_POLICY_URL} from '@env';
import {useAppState} from '../../AppContext';
import {
  Onboarding2,
  Onboarding1,
  Onboarding3,
} from '../../assets/svg/illustrations/';
import {useGeolocationState} from '../../GeolocationContext';
import {StyleSheet} from '../../theme';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import StepOuterContainer from './components/StepContainer';
import Illustration from './components/Illustration';
import NavigationControls from './components/NavigationControls';
import ThemeText from '../../components/text';

type StepProps = {
  navigation: StackNavigationProp<OnboardingStackParams>;
};
type OnboardingStackParams = {
  StepOne: undefined;
  StepTwo: undefined;
  StepThree: undefined;
};
const Stack = createStackNavigator<OnboardingStackParams>();

const Onboarding = () => {
  return (
    <>
      <Stack.Navigator initialRouteName="StepOne" headerMode="none">
        <Stack.Screen
          name="StepOne"
          component={StepOne}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        ></Stack.Screen>
        <Stack.Screen
          name="StepTwo"
          component={StepTwo}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        ></Stack.Screen>
        <Stack.Screen
          name="StepThree"
          component={StepThree}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        ></Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

const StepOne: React.FC<StepProps> = ({navigation}) => {
  const styles = useStyles();
  const onNavigate = () => {
    navigation.push('StepTwo');
  };
  return (
    <>
      <Illustration Svg={Onboarding1} />
      <StepOuterContainer>
        <View style={styles.textContainer} accessible={true}>
          <ThemeText style={[styles.title, styles.text]}>
            Velkommen som testpilot!{' '}
          </ThemeText>
          <ThemeText style={styles.text}>
            Du bruker nå en betaversjon av den nye AtB-appen. Her kan du
            planlegge reiser og sjekke avgangstider i Trøndelag. Appen vil bli
            jevnlig oppdatert med nye funksjoner.
          </ThemeText>
        </View>
        <NavigationControls currentPage={1} onNavigate={onNavigate} />
      </StepOuterContainer>
    </>
  );
};
const StepTwo: React.FC<StepProps> = ({navigation}) => {
  const styles = useStyles();
  const onNavigate = () => {
    navigation.push('StepThree');
  };
  return (
    <>
      <Illustration Svg={Onboarding2} />
      <StepOuterContainer>
        <View style={styles.textContainer} accessible={true}>
          <ThemeText style={[styles.title, styles.text]}>
            Bidra til å gjøre appen bedre
          </ThemeText>
          <ThemeText style={styles.text}>
            Vi trenger dine idéer og tilbakemeldinger for å gjøre appen bedre.
            Disse deler du enklest ved å velge chatikonet oppe i høyre hjørne av
            appen. Chatten er anonym.
          </ThemeText>
        </View>
        <NavigationControls currentPage={2} onNavigate={onNavigate} />
      </StepOuterContainer>
    </>
  );
};
const StepThree: React.FC<StepProps> = () => {
  const styles = useStyles();
  const {completeOnboarding} = useAppState();
  const {status, requestPermission} = useGeolocationState();
  const [requestedOnce, setRequestedOnce] = useState(false);
  useEffect(() => {
    if (requestedOnce && status) {
      completeOnboarding();
    }
  }, [status, requestedOnce]);

  async function onRequestPermission() {
    if (status !== 'granted') await requestPermission();
    setRequestedOnce(true);
  }
  return (
    <>
      <Illustration Svg={Onboarding3} />
      <StepOuterContainer>
        <View style={styles.textContainer} accessible={true}>
          <ThemeText style={[styles.title, styles.text]}>
            Bedre opplevelse med posisjonsdeling
          </ThemeText>
          <ThemeText style={styles.text}>
            Ved å tillate deling av posisjon kan du finne nærmeste holdeplass og
            planlegge reisen fra din lokasjon. Du kan når som helst slutte å
            dele posisjon.
          </ThemeText>
        </View>
        <NavigationControls
          currentPage={3}
          onNavigate={onRequestPermission}
          title="Fullfør"
          arrow={false}
        >
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(PRIVACY_POLICY_URL ?? 'https://www.atb.no')
            }
          >
            <ThemeText style={[styles.text, styles.privacyPolicy]}>
              Les vår personvernerklæring
            </ThemeText>
          </TouchableOpacity>
        </NavigationControls>
      </StepOuterContainer>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme, themeName) => ({
  textContainer: {
    padding: theme.spacings.xLarge,
  },
  title: {
    fontWeight: 'bold',
  },
  text: {
    fontSize: theme.text.sizes.body,
    color: theme.text.colors.primary,
    marginTop: theme.spacings.medium,
  },
  privacyPolicy: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: theme.spacings.medium,
  },
}));

export default Onboarding;
