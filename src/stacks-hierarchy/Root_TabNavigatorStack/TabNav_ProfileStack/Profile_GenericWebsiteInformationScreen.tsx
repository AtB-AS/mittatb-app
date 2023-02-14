import React from 'react';
import {useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import GenericWebsiteInformationScreen from '@atb/translations/screens/subscreens/GenericWebsiteInformationScreen';

export const Profile_GenericWebsiteInformationScreen = () => {
  const {t} = useTranslation();

  return <ThemeText>{t(GenericWebsiteInformationScreen.message)}</ThemeText>;
};
