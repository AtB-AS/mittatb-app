import {useTranslation} from '@atb/translations';
import {useEffect} from 'react';
import {getAuth, setLanguageCode} from '@react-native-firebase/auth';

export const useUpdateAuthLanguageOnChange = () => {
  const {language} = useTranslation();

  useEffect(() => {
    if (language) setLanguageCode(getAuth(), language);
  }, [language]);
};
