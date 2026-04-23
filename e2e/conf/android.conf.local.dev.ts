import {config as androidConfig} from './android.conf.ts';

const androidCapabilities = (androidConfig.capabilities as Record<string, any>[])[0];

export const config: WebdriverIO.Config = {
  ...androidConfig,
  capabilities: [
    {
      ...androidCapabilities,
      'appium:appPackage': 'no.mittatb.debug',
      'appium:appWaitPackage': 'no.mittatb.debug',
      'appium:app': `${process.env.PWD}/../android/app/build/outputs/apk/app/debug/app-app-debug.apk`,
    },
  ],
};
