import React, {useEffect, useState} from 'react';
import {Linking, Text, TouchableOpacity, View} from 'react-native';
import {PRIVACY_POLICY_URL} from 'react-native-dotenv';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useAppState} from '../../AppContext';
import {
  Onboarding2,
  Onboarding1,
  Onboarding3,
} from '../../assets/svg/illustrations';
import {useGeolocationState} from '../../GeolocationContext';
import {StyleSheet} from '../../theme';
import colors from '../../theme/colors';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import {SvgProps} from 'react-native-svg';
import {ArrowRight} from '../../assets/svg/icons/navigation';
import {Dot} from '../../assets/svg/icons/other';
import NavigationRoot from '../../navigation/TabNavigator';
type StepProps = {
  navigation: StackNavigationProp<OnboardingStackParams>;
};
type OnboardingStackParams = {
  StepOne: StepProps;
  StepTwo: StepProps;
  StepThree: StepProps;
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
    navigation.navigate('StepTwo');
  };
  return (
    <>
      <Illustration Svg={Onboarding1} />
      <StepOuterContainer>
        <View style={styles.textContainer}>
          <Text style={[styles.title, styles.text]}>
            Velkommen som testpilot!{' '}
          </Text>
          <Text style={styles.text}>
            Du bruker nå en betaversjon av den nye AtB-appen. Her kan du
            planlegge reiser og sjekke avgangstider i Trøndelag. Appen vil bli
            jevnlig oppdatert med nye funksjoner.
          </Text>
        </View>
        <NavigationItems currentPage={1} onNavigate={onNavigate} />
      </StepOuterContainer>
    </>
  );
};
const StepTwo: React.FC<StepProps> = ({navigation}) => {
  const styles = useStyles();
  const onNavigate = () => {
    navigation.navigate('StepThree');
  };
  return (
    <>
      <Illustration Svg={Onboarding2} />
      <StepOuterContainer>
        <View style={styles.textContainer}>
          <Text style={[styles.title, styles.text]}>
            Bidra til å gjøre appen bedre
          </Text>
          <Text style={styles.text}>
            Vi trenger dine idéer og tilbakemeldinger for å gjøre appen bedre.
            Disse deler du enklest ved å velge chatikonet oppe i høyre hjørne av
            appen. Chatten er anonym.
          </Text>
        </View>
        <NavigationItems currentPage={2} onNavigate={onNavigate} />
      </StepOuterContainer>
    </>
  );
};
const StepThree: React.FC<StepProps> = ({navigation}) => {
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
        <View style={styles.textContainer}>
          <Text style={[styles.title, styles.text]}>
            Bedre opplevelse med posisjonsdeling
          </Text>
          <Text style={styles.text}>
            Ved å tillate deling av posisjon kan du finne nærmeste holdeplass og
            planlegge reisen fra din lokasjon. Du kan når som helst slutte å
            dele posisjon.
          </Text>
        </View>
        <NavigationItems
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
            <Text style={styles.privacyPolicy}>
              Les vår personvernerklæring
            </Text>
          </TouchableOpacity>
        </NavigationItems>
      </StepOuterContainer>
    </>
  );
};

const StepOuterContainer: React.FC = ({children}) => {
  const styles = useStyles();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>{children}</View>
    </SafeAreaView>
  );
};
type NavigateButtonProps = {
  onNavigate(): void;
  title?: string;
  arrow?: boolean;
  currentPage: number;
};
const NavigationItems: React.FC<NavigateButtonProps> = ({
  onNavigate,
  title = 'Fortsett',
  arrow = true,
  children,
  currentPage,
}) => {
  const styles = useStyles();
  const numberDots = 3;
  return (
    <View style={styles.navigationContainer}>
      <View style={styles.bulletContainer}>
        {[...Array(numberDots)].map((v, i) => (
          <Dot
            style={styles.bullet}
            fill={currentPage === i + 1 ? '#007C92' : '#C3C6C9'}
            key={i}
            width={12}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={onNavigate}>
        <Text style={styles.buttonText}>{title}</Text>
        {arrow && <ArrowRight style={styles.buttonIcon} />}
      </TouchableOpacity>
      {children}
    </View>
  );
};
type IllustrationProps = {
  Svg: React.FC<SvgProps>;
};
const Illustration: React.FC<IllustrationProps> = ({Svg}) => {
  const styles = useStyles();
  return (
    <View style={styles.svgContainer}>
      <Svg height="100%" width="100%" style={styles.figure} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
    alignItems: 'center',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    maxWidth: 500,
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
  },
  textContainer: {
    padding: theme.spacings.xLarge,
    backgroundColor: 'rgba(235,236,237,0.85)',
  },
  title: {
    fontWeight: 'bold',
  },
  svgContainer: {
    backgroundColor: theme.background.level2,
    width: '100%',
    maxHeight: '50%',
  },
  figure: {
    flex: 1,
  },
  text: {
    fontSize: theme.text.sizes.body,
    color: theme.text.colors.primary,
    marginTop: 12,
  },
  privacyPolicy: {
    fontSize: theme.text.sizes.body,
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: theme.text.colors.primary,
    marginTop: theme.spacings.medium,
  },
  navigationContainer: {
    width: '100%',
    padding: theme.spacings.xLarge,
    minHeight: 170,
  },
  bulletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bullet: {
    marginHorizontal: theme.spacings.medium / 2,
    marginVertical: theme.spacings.medium,
  },
  button: {
    backgroundColor: colors.secondary.cyan,
    width: '100%',
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: theme.text.sizes.body,
    fontWeight: '600',
    color: theme.text.colors.primary,
  },
  buttonIcon: {
    position: 'absolute',
    right: theme.spacings.medium,
  },
}));

export default Onboarding;
