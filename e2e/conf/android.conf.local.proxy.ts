import {config as androidConfig} from './android.conf.ts';


const androidCapabilities = (androidConfig.capabilities as Record<string, any>[])[0];

// @ts-ignore
export const config: WebdriverIO.Config = {
  ...androidConfig,
  services: [
    [
      'appium',
      {
        args: {allowInsecure: '*:session_discovery', allowCors: true, usePlugins: 'appium-interceptor'},
        logPath: './results',
        env: {
          ...(process.env.UPSTREAM_PROXY && {UPSTREAM_PROXY: process.env.UPSTREAM_PROXY}),
          ...(process.env.NODE_EXTRA_CA_CERTS && {NODE_EXTRA_CA_CERTS: process.env.NODE_EXTRA_CA_CERTS}),
        },
      },
    ],
  ],
  capabilities: [
    {
      ...androidCapabilities,
      'appium:appPackage': 'no.mittatb.debug',
      'appium:appWaitPackage': 'no.mittatb.debug',
      'appium:app': `${process.env.PWD}/../android/app/build/outputs/apk/app/debug/app-app-debug.apk`,
      // @ts-ignore
      'appium:intercept': true,
    },
  ],
};
