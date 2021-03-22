import {useAppState} from '@atb/AppContext';
import {
  Onboarding1,
  Onboarding2,
  Onboarding3,
} from '@atb/assets/svg/illustrations';
import ThemeText from '@atb/components/text';
import {useGeolocationState} from '@atb/GeolocationContext';
import {StyleSheet} from '@atb/theme';
import {OnboardingTexts, useTranslation} from '@atb/translations';
import {PRIVACY_POLICY_URL} from '@env';
import {
  createStackNavigator,
  StackNavigationProp,
  TransitionPresets,
} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {Linking, TouchableOpacity, View} from 'react-native';
import Illustration from './components/Illustration';
import NavigationControls from './components/NavigationControls';
import StepOuterContainer from './components/StepContainer';

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
    <StepOuterContainer>
      <Illustration Svg={Onboarding1} />
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
  );
};
const StepTwo: React.FC<StepProps> = ({navigation}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const onNavigate = () => {
    navigation.push('StepThree');
  };
  return (
    <StepOuterContainer>
      <Illustration Svg={Onboarding2} />
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
    <StepOuterContainer>
      <Illustration Svg={Onboarding3} />
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
  );
};

const useStyles = StyleSheet.createThemeHook((theme, themeName) => ({
  textContainer: {
    padding: theme.spacings.xLarge,
    paddingTop: 0,
    paddingBottom: 0,
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
