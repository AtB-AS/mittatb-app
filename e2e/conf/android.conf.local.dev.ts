import {config as sharedConfig} from './wdio.conf.ts';

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  ...{
    port: 4723,
    services: [
      // For options and arguments see
      // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
      [
        'appium',
        {
          //args: {},
          //command: 'appium',
        },
      ],
      [
        'visual',
        {
          // folder options are set in the tests
          formatImageName: '{tag}-{deviceName}-{width}x{height}',
          createJsonReportFiles: true,
          autoSaveBaseline: false,
          isHybridApp: true,
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
        //appiumVersion: '',
        platformName: 'Android',
        'appium:language': 'en',
        'appium:locale': 'US',
        // @ts-ignore
        'appium:adbExecTimeout': 120000,
        maxInstances: 1,
        'appium:isHeadless': true,
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android',
        'appium:appPackage': 'no.mittatb.debug',
        'appium:appWaitPackage': 'no.mittatb.debug',
        'appium:appActivity': 'no.mittatb.MainActivity',
        'appium:appWaitActivity': 'no.mittatb.MainActivity',
        'appium:app': `${process.env.PWD}/../android/app/build/outputs/apk/beacons/debug/app-beacons-debug.apk`,

        //'appium:appWaitForLaunch': true,
        //'appium:skipDeviceInitialization': true,
        //noReset: true,
        //fullReset: false,
        //'appium:gpsEnabled': false,
        //'appium:avd': 'Pixel_5_API_30',
        //'appium:skipUnlock': true,
      },
    ],
  },
};

//exports.config = config;
