import {useTranslation} from '@atb/translations';
import React, {useCallback} from 'react';
import {
  OnboardingScreenComponent,
  useOnboardingNavigation,
} from '@atb/modules/onboarding';
import {Close, Confirm} from '@atb/assets/svg/mono-icons/actions';
import {usePreferencesContext} from '@atb/modules/preferences';
import {TravelAidTexts} from '@atb/translations';
import {useFocusOnLoad} from '@atb/utils/use-focus-on-load';
import {RootStackScreenProps} from './navigation-types';

type Props = RootStackScreenProps<'Root_TravelAidOnboardingScreen'>;

export const Root_TravelAidOnboardingScreen = ({navigation}: Props) => {
  const focusRef = useFocusOnLoad(navigation);
  const {t} = useTranslation();

  const {setPreference} = usePreferencesContext();
  const {continueFromOnboardingSection} = useOnboardingNavigation();

  const onActivate = useCallback(() => {
    continueFromOnboardingSection('travelAid');
    setPreference({journeyAidEnabled: true});
  }, [continueFromOnboardingSection, setPreference]);

  const onDismiss = useCallback(() => {
    continueFromOnboardingSection('travelAid');
  }, [continueFromOnboardingSection]);

  return (
    <OnboardingScreenComponent
      title={t(TravelAidTexts.onboarding.title)}
      description={t(TravelAidTexts.onboarding.description)}
      footerButton={{
        onPress: onActivate,
        text: t(TravelAidTexts.onboarding.activate),
        rightIcon: {svg: Confirm},
        expanded: true,
      }}
      secondaryFooterButton={{
        onPress: onDismiss,
        text: t(TravelAidTexts.onboarding.skip),
        rightIcon: {svg: Close},
        expanded: true,
      }}
      testID="travelAidOnboarding"
      focusRef={focusRef}
    />
  );
};
