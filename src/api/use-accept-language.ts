import {useTranslation} from '@atb/translations';

export const useAcceptLanguage = () => {
  // All the current app language codes ('nb', 'en', 'nn') can be used directly as Accept-Language headers.
  // However, we might want to map these into e.g. nb-NO, en-US and nn-NO.
  const {language: acceptLanguage} = useTranslation();
  return acceptLanguage;
};
