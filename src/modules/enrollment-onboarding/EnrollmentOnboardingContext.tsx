import {createContext, useCallback, useContext, useMemo} from 'react';
import {EnrollmentOnboardingNavigationProps} from './navigation-types';
import {useNavigation} from '@react-navigation/native';
import {enrollmentOnboardingConfig} from './enrollment-onboarding-config';

const EnrollmentOnboardingContext = createContext<{
  configId: string;
} | null>(null);

export function EnrollmentOnboardingContextProvider({
  children,
  configId,
}: {
  children: React.ReactNode;
  configId: string;
}) {
  return (
    <EnrollmentOnboardingContext.Provider value={{configId}}>
      {children}
    </EnrollmentOnboardingContext.Provider>
  );
}

export function useEnrollmentOnboarding(currentScreenName: string) {
  const context = useContext(EnrollmentOnboardingContext);
  if (!context)
    throw new Error(
      'useEnrollmentOnboarding must be used within EnrollmentOnboardingProvider',
    );

  const navigation = useNavigation<EnrollmentOnboardingNavigationProps>();

  const config = useMemo(
    () => enrollmentOnboardingConfig.find((c) => c.id === context.configId),
    [context.configId],
  );

  const navigateToNextScreen = useCallback(() => {
    if (!config) return;

    const currentIndex = config.onboardingScreens.findIndex(
      (s) => s.name === currentScreenName,
    );
    const nextScreen = config.onboardingScreens[currentIndex + 1];

    if (nextScreen) {
      navigation.navigate(nextScreen.name);
    } else {
      navigation.getParent()?.goBack();
    }
  }, [config, currentScreenName, navigation]);

  return {navigateToNextScreen};
}
