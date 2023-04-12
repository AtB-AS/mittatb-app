import React from 'react';
import {lobot} from './';
import {useRemoteConfig} from '../RemoteConfigContext';
import {useLocaleContext} from '@atb/LocaleProvider';

export const AppLanguageProvider: React.FC = ({children}) => {
  const locale = useLocaleContext();
  const {enable_i18n} = useRemoteConfig();
  if (!enable_i18n) {
    return <>{children}</>;
  }

  return (
    <lobot.LanguageProvider value={locale.language}>
      {children}
    </lobot.LanguageProvider>
  );
};
