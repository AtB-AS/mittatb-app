import {config as androidConfig} from './android.conf.ts';

// When chaining through an upstream MITM proxy (e.g. WireMock in recording mode),
// that proxy presents a self-signed cert. Setting this here ensures the env var is
// inherited by the Appium child process spawned by @wdio/appium-service.
if (process.env.UPSTREAM_PROXY) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

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
        },
      },
    ],
  ],
  capabilities: [
    {
      ...androidCapabilities,
      // @ts-ignore
      'appium:intercept': true,
    },
  ],
};
