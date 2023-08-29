import React from 'react';
import {lobot} from './';
import {useLocaleContext} from '@atb/LocaleProvider';

export const AppLanguageProvider: React.FC = ({children}) => {
  const locale = useLocaleContext();

  return (
    <lobot.LanguageProvider value={locale.language}>
      {children}
    </lobot.LanguageProvider>
  );
};
