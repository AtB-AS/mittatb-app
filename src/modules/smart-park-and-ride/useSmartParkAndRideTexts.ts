import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useTextForLanguage} from '@atb/translations/utils';
import {useTranslation} from '@atb/translations';
import SmartParkAndRideTexts from '@atb/translations/screens/subscreens/SmartParkAndRide';

export interface SmartParkAndRideTexts {
  howItWorks: {
    heading: string;
    title: string;
    description: string;
    link: string;
  };
}

export const useSmartParkAndRideTexts = (): SmartParkAndRideTexts => {
  const {t} = useTranslation();
  const {appTexts} = useFirestoreConfigurationContext();

  return {
    howItWorks: {
      heading: t(SmartParkAndRideTexts.howItWorks.heading),
      title: t(SmartParkAndRideTexts.howItWorks.title),
      description:
        useTextForLanguage(appTexts?.sparHowItWorksDescription) || '',
      link: t(SmartParkAndRideTexts.howItWorks.link),
    },
  };
};
