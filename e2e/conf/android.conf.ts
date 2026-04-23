import {config as sharedConfig} from './wdio.conf.ts';

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  services: [
    [
      'appium',
      {
        args: {allowInsecure: '*:session_discovery', allowCors: true},
      },
    ],
    [
      'visual',
      {
        formatImageName: '{tag}-{deviceName}-{width}x{height}',
        autoSaveBaseline: false,
        isHybridApp: true,
        compareOptions: {
          createJsonReportFiles: true,
        },
        baselineFolder: './screenshots/visualTests/baseline',
        actualFolder: './screenshots/visualTests/actual',
        diffFolder: './screenshots/visualTests/diff',
      },
    ],
    [
      'performancetotal',
      {
        disableAppendToExistingFile: false,
        performanceResultsFileName: `performance-results_${new Date().getTime()}`,
        dropResultsFromFailedTest: false,
        performanceResultsDirectory: 'results/performance-results',
        analyzeByBrowser: false,
        recentDays: 0,
      },
    ],
  ],
  capabilities: [
    {
      platformName: 'Android',
      'appium:language': 'en',
      'appium:locale': 'US',
      // @ts-ignore
      'appium:adbExecTimeout': 120000,
      'appium:isHeadless': true,
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android',
      'appium:appPackage': 'no.mittatb.staging',
      'appium:appWaitPackage': 'no.mittatb.staging',
      'appium:appActivity': 'no.mittatb.MainActivity',
      'appium:appWaitActivity': 'no.mittatb.MainActivity',
      'appium:app': `${
        process.env.APP_PATH || 'EMPTY_ENV_APP_PATH'
      }/e2e/apk/app-staging.apk`,
    },
  ],
};
