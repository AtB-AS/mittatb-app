import {useRemoteConfigContext} from '@atb/modules/remote-config';
import React from 'react';
import {
  RootNavigationProps,
  RootStackParamList,
  RootStackScreenProps,
} from './navigation-types';
import {useHasReservationOrAvailableFareContract} from '@atb/modules/ticketing';
import {Support} from '@atb/assets/svg/mono-icons/actions';
import {Phone} from '@atb/assets/svg/mono-icons/devices';
import {Receipt} from '@atb/assets/svg/mono-icons/ticketing';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {AnonymousPurchasesTexts, useTranslation} from '@atb/translations';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {
  OnboardingFullScreenView,
  useOnboardingContext,
  useOnboardingFlow,
} from '@atb/modules/onboarding';
import {View} from 'react-native';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {LeftButtonProps, RightButtonProps} from '@atb/components/screen-header';
import {Theme} from '@atb/theme/colors';
import {PartialRoute, Route, useNavigation} from '@react-navigation/native';

type Props = RootStackScreenProps<'Root_PurchaseAsAnonymousConsequencesScreen'>;

const getThemeColor = (theme: Theme) => theme.color.background.accent[0];
const getAccentColor = (theme: Theme) => theme.color.background.accent[1];

export const Root_PurchaseAsAnonymousConsequencesScreen = ({
  navigation,
  route: {params},
}: Props) => {
  const {enable_vipps_login} = useRemoteConfigContext();
  const hasReservationOrAvailableFareContract =
    useHasReservationOrAvailableFareContract();
  const completeUserCreationOnboardingAndEnterApp =
    useCompleteUserCreationOnboardingAndEnterApp();

  const onPressLogin = () => {
    let screen: keyof RootStackParamList = 'Root_LoginPhoneInputScreen';
    if (hasReservationOrAvailableFareContract) {
      screen = 'Root_LoginAvailableFareContractWarningScreen';
    } else if (enable_vipps_login) {
      screen = 'Root_LoginOptionsScreen';
      return navigation.navigate(screen, {showGoBack: true});
    }
    return navigation.navigate(screen, {});
  };

  return (
    <AnonymousPurchaseConsequencesScreenComponent
      onPressLogin={params.showLoginButton ? onPressLogin : undefined}
      onPressContinueWithoutLogin={completeUserCreationOnboardingAndEnterApp}
      leftButton={
        params?.transitionOverride !== 'slide-from-bottom'
          ? {type: 'back'}
          : undefined
      }
      rightButton={
        params?.transitionOverride === 'slide-from-bottom'
          ? {type: 'close'}
          : undefined
      }
    />
  );
};

type AnonymousPurchaseConsequencesScreenComponentProps = {
  onPressContinueWithoutLogin: () => void;
  onPressLogin?: () => void;
  leftButton?: LeftButtonProps;
  rightButton?: RightButtonProps;
};
export const AnonymousPurchaseConsequencesScreenComponent = ({
  onPressContinueWithoutLogin,
  onPressLogin,
  leftButton,
  rightButton,
}: AnonymousPurchaseConsequencesScreenComponentProps) => {
  const styles = useStyle();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const focusRef = useFocusOnLoad();

  const themeColor = getThemeColor(theme);

  const loginButton = {
    onPress: onPressLogin || (() => {}),
    text: t(AnonymousPurchasesTexts.consequences.button.login.label),
    accessibilityHint: t(
      AnonymousPurchasesTexts.consequences.button.login.a11yHint,
    ),
    expanded: true,
  };

  const continueWithoutLoginButton = {
    onPress: onPressContinueWithoutLogin,
    text: t(AnonymousPurchasesTexts.consequences.button.accept.label),
    accessibilityHint: t(
      AnonymousPurchasesTexts.consequences.button.accept.a11yHint,
    ),
    rightIcon: onPressLogin ? undefined : {svg: ArrowRight},
    expanded: true,
  };

  return (
    <OnboardingFullScreenView
      fullScreenHeaderProps={{leftButton, rightButton}}
      footerButton={onPressLogin ? loginButton : continueWithoutLoginButton}
      secondaryFooterButton={
        onPressLogin ? continueWithoutLoginButton : undefined
      }
      testID={onPressLogin ? 'logIn' : 'acceptLimitations'}
      secondaryTestID={onPressLogin ? 'acceptLimitations' : ''}
    >
      <View ref={focusRef} accessible>
        <ThemeText
          typography="heading__xl"
          color={themeColor}
          style={styles.header}
        >
          {t(AnonymousPurchasesTexts.consequences.title)}
        </ThemeText>
      </View>
      <Consequence
        value={t(AnonymousPurchasesTexts.consequences.messages[0])}
        icon={<ThemeIcon svg={Phone} color={themeColor} size="large" />}
      />
      <Consequence
        value={t(AnonymousPurchasesTexts.consequences.messages[1])}
        icon={<ThemeIcon svg={Receipt} color={themeColor} size="large" />}
      />
      <Consequence
        value={t(AnonymousPurchasesTexts.consequences.messages[2])}
        icon={<ThemeIcon svg={Support} color={themeColor} size="large" />}
      />
    </OnboardingFullScreenView>
  );
};

export const Consequence = ({
  value,
  icon,
}: {
  value: string;
  icon: React.JSX.Element;
}) => {
  const styles = useStyle();
  const {theme} = useThemeContext();
  return (
    <View style={styles.consequence}>
      <View style={styles.icon}>{icon}</View>
      <ThemeText style={styles.description} color={getThemeColor(theme)}>
        {value}
      </ThemeText>
    </View>
  );
};

/**
 * Hook to complete the onboarding process and correctly navigate to the next screen.
 *
 * @returns {Function} A function that, when called, checks if the onboarding is not completed,
 * completes it if not, and then navigates to the next screen using enterApp.
 */
const useCompleteUserCreationOnboardingAndEnterApp = () => {
  const {completeOnboardingSection} = useOnboardingContext();

  const enterApp = useEnterApp();

  return () => {
    completeOnboardingSection('userCreation');
    enterApp();
  };
};

/**
 * This hook provides a function to navigate directly to the next screen,
 * with Root_TabNavigatorStack as the only screen you can go back to.
 * It omits unwanted animations or transitions in between.
 *
 * @returns {Function} A function that when called, navigates to either the
 * 'Root_TabNavigatorStack', or the next onboarding screen based on the app's
 * current state.
 */
const useEnterApp = () => {
  const {getNextOnboardingSection} = useOnboardingFlow();
  const navigation = useNavigation<RootNavigationProps>();

  return () => {
    const nextOnboardingSection = getNextOnboardingSection(undefined, true);

    const routes: PartialRoute<
      Route<keyof RootStackParamList, object | undefined>
    >[] = [{name: 'Root_TabNavigatorStack'}];

    const {name, params} = nextOnboardingSection?.initialScreen || {};
    name && routes.push({name, params});

    navigation.reset({routes});
  };
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: getThemeColor(theme).background,
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    marginHorizontal: theme.spacing.xLarge,
  },
  mainContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    margin: theme.spacing.xLarge,
    textAlign: 'center',
  },
  button: {
    marginHorizontal: theme.spacing.medium,
    marginTop: theme.spacing.medium,
  },
  description: {
    paddingHorizontal: theme.spacing.medium,
    flex: 1,
  },
  icon: {
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.medium,
  },
  consequence: {
    backgroundColor: getAccentColor(theme).background,
    borderRadius: theme.border.radius.regular,
    marginTop: theme.spacing.medium,
    flexDirection: 'row',
    padding: theme.spacing.medium,
  },
}));
