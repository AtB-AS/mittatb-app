import {useTranslation} from '@atb/translations';
import {useEffect} from 'react';
import auth from '@react-native-firebase/auth';

export const useUpdateAuthLanguageOnChange = () => {
  const {language} = useTranslation();

  useEffect(() => {
    if (language) auth().setLanguageCode(language);
  }, [language]);
};
