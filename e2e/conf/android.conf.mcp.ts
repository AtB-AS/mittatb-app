import {config as localDevConfig} from './android.conf.local.dev.ts';

const localDevCapabilities = (
  localDevConfig.capabilities as Record<string, any>[]
)[0];

export const config: WebdriverIO.Config = {
  ...localDevConfig,
  specs: [],
  capabilities: [
    {
      ...localDevCapabilities,
      'appium:isHeadless': false,
    },
  ],
};
