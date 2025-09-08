import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';

export interface SmartParkAndRideOnboardingTexts {
  information: {
    title: string;
    description: string;
    penaltyNotice: string;
    buttonText: string;
  };
  automaticRegistration: {
    title: string;
    description: string;
    descriptionLinkText: string;
    descriptionLinkUrl: string;
    buttonText: string;
  };
}

export const useSmartParkAndRideOnboardingTexts =
  (): SmartParkAndRideOnboardingTexts => {
    const {t} = useTranslation();
    const {appTexts} = useFirestoreConfigurationContext();

    return {
      information: {
        title: t(SmartParkAndRideTexts.onboarding.information.title),
        description:
          useTextForLanguage(appTexts?.sparInformationDescription) || '',
        penaltyNotice:
          useTextForLanguage(appTexts?.sparInformationPenaltyNotice) || '',
        buttonText: t(SmartParkAndRideTexts.onboarding.information.buttonText),
      },
      automaticRegistration: {
        title: t(SmartParkAndRideTexts.onboarding.automaticRegistration.title),
        description:
          useTextForLanguage(appTexts?.sparAutomaticRegistrationDescription) ||
          '',
        descriptionLinkText:
          useTextForLanguage(
            appTexts?.sparAutomaticRegistrationDescriptionLinkText,
          ) || '',
        descriptionLinkUrl:
          useTextForLanguage(
            appTexts?.sparAutomaticRegistrationDescriptionLinkUrl,
          ) || '',
        buttonText: t(
          SmartParkAndRideTexts.onboarding.automaticRegistration.buttonText,
        ),
      },
    };
  };
