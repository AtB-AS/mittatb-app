import { config as sharedConfig } from './wdio.conf';

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  ...{
    port: 4723,
    //path: '/wd/hub',
    services: [
      ['appium',
        {
          // For options see
          // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
          args: {
            // For arguments see
            // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
          },
          command: 'appium',
        },
      ],
    ],
    capabilities: [{
      //appiumVersion: '',
      platformName: 'Android',
      'appium:language': 'en',
      'appium:locale': 'US',
      // @ts-ignore
      'appium:adbExecTimeout': 120000,
      //noReset: true,
      //fullReset: false,
      maxInstances: 1,
      //automationName: 'UiAutomator2',
      //deviceName: AndroidInfo.deviceName(),
      //deviceName: 'Android',
      //platformVersion: AndroidInfo.platFormVersion(),
      //app: path.resolve(`./apps/${AndroidInfo.appName()}`)
      //"appium:waitForIdleTimeout": 10000,
      //app: '/Users/tormos/Documents/atb/mittatb-app/e2e/appium/android/app-staging.apk',

      'appium:isHeadless': true,
      //'appium:gpsEnabled': false,
      //'appium:avd': 'Pixel_5_API_30',
      //'appium:skipUnlock': true,
      'appium:automationName': 'UiAutomator2',
      //'appium:deviceName': 'emulator-5554',//
      'appium:deviceName': 'Android',
      //'appium:appPackage': 'no.mittatb.staging',
      //'appium:appActivity': '.MainActivity',
      'appium:appPackage': 'no.mittatb.staging',
      'appium:appWaitPackage': 'no.mittatb.staging',
      'appium:appActivity': 'no.mittatb.MainActivity',
      'appium:appWaitActivity': 'no.mittatb.MainActivity',
      //'appium:app': '../../android/app/build/outputs/apk/debug/app-debug.apk',
      //TODO 'appium:app': '/Users/tormos/Documents/atb/mittatb-app/e2e/appium/app/app-staging.apk',
      'appium:app': `${process.env.APP_PATH || "EMPTY_ENV_APP_PATH"}/e2e/appium/app2/app-staging.apk`,
      //'appium:appWaitForLaunch': true,
      //'appium:skipDeviceInitialization': true
    }],
  }
};

exports.config = config;