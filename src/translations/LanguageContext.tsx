import React from 'react';
import {lobot} from './';
import {useLocaleContext} from '@atb/LocaleProvider';

interface Props {
  children: React.ReactNode;
}

export const AppLanguageContextProvider = ({children}: Props) => {
  const locale = useLocaleContext();

  return (
    <lobot.LanguageProvider value={locale.language}>
      {children}
    </lobot.LanguageProvider>
  );
};
