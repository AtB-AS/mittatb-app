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
import {useTranslation} from '../../utils/language';
import {OnboardingTexts} from '../../translations';

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
  const {t} = useTranslation();
  const onNavigate = () => {
    navigation.push('StepTwo');
  };
  return (
    <>
      <Illustration Svg={Onboarding1} />
      <StepOuterContainer>
        <View style={styles.textContainer} accessible={true}>
          <ThemeText style={[styles.title, styles.text]}>
            {t(OnboardingTexts.step1.title)}
          </ThemeText>
          <ThemeText style={styles.text}>
            {t(OnboardingTexts.step1.description)}
          </ThemeText>
        </View>
        <NavigationControls currentPage={1} onNavigate={onNavigate} />
      </StepOuterContainer>
    </>
  );
};
const StepTwo: React.FC<StepProps> = ({navigation}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const onNavigate = () => {
    navigation.push('StepThree');
  };
  return (
    <>
      <Illustration Svg={Onboarding2} />
      <StepOuterContainer>
        <View style={styles.textContainer} accessible={true}>
          <ThemeText style={[styles.title, styles.text]}>
            {t(OnboardingTexts.step2.title)}
          </ThemeText>
          <ThemeText style={styles.text}>
            {t(OnboardingTexts.step2.description)}
          </ThemeText>
        </View>
        <NavigationControls currentPage={2} onNavigate={onNavigate} />
      </StepOuterContainer>
    </>
  );
};
const StepThree: React.FC<StepProps> = () => {
  const styles = useStyles();
  const {t} = useTranslation();
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
            {t(OnboardingTexts.step3.title)}
          </ThemeText>
          <ThemeText style={styles.text}>
            {t(OnboardingTexts.step3.description)}
          </ThemeText>
        </View>
        <NavigationControls
          currentPage={3}
          onNavigate={onRequestPermission}
          title={t(OnboardingTexts.navigation.complete)}
          arrow={false}
        >
          <TouchableOpacity
            accessibilityRole="link"
            accessibilityHint={t(OnboardingTexts.step3.privacyLink.a11yHint)}
            onPress={() =>
              Linking.openURL(PRIVACY_POLICY_URL ?? 'https://www.atb.no')
            }
          >
            <ThemeText type="body" style={[styles.text, styles.privacyPolicy]}>
              {t(OnboardingTexts.step3.privacyLink.text)}
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
    marginTop: theme.spacings.medium,
  },
  privacyPolicy: {
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: theme.spacings.medium,
  },
}));

export default Onboarding;
