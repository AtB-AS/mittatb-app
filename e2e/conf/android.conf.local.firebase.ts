import {config as androidConfig} from './android.conf.ts';

const androidCapabilities = (androidConfig.capabilities as Record<string, any>[])[0];

export const config: WebdriverIO.Config = {
  ...androidConfig,
  capabilities: [
    {
      ...androidCapabilities,
      'appium:app': `${process.env.PWD}/apk/app-staging.apk`,
    },
  ],
};
