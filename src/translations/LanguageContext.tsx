import React from 'react';
import {lobot} from './';
import {useRemoteConfig} from '../RemoteConfigContext';
import {useLocaleContext} from '@atb/LocaleProvider';

const AppLanguageProvider: React.FC = ({children}) => {
  const localeContext = useLocaleContext();
  const {enable_i18n} = useRemoteConfig();
  if (!enable_i18n) {
    return <>{children}</>;
  }

  return (
    <lobot.LanguageProvider value={localeContext.locale.language}>
      {children}
    </lobot.LanguageProvider>
  );
};

export default AppLanguageProvider;
