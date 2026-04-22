import mergeResults from 'wdio-mochawesome-reporter/mergeResults.js';

export const config: WebdriverIO.Config = {
  runner: 'local',
  tsConfigPath: './tsconfig.json',
  port: 4723,

  specs: ['../test/specs/**/*.e2e.ts'],
  exclude: [],
  maxInstances: 1,
  capabilities: [{}],

  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 420000,
  connectionRetryCount: 3,

  services: ['appium'],
  framework: 'mocha',

  reporters: [
    [
      'spec',
      {
        showPreface: false,
      },
    ],
    [
      'junit',
      {
        outputDir: './results',
        outputFileFormat: function (opts) {
          return `results-junit-${opts.capabilities['platformName']}-${opts.cid}.xml`;
        },
      },
    ],
    [
      'mochawesome',
      {
        outputDir: './results',
        outputFileFormat: function (opts) {
          return `results-mochawesome-${opts.capabilities['platformName']}-${opts.cid}.json`;
        },
      },
    ],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 600000,
  },

  onComplete: function () {
    try {
      mergeResults(
        './results',
        'results-mochawesome*',
        'results-mochawesome.json',
      );
    } catch (e) {
      console.warn('Could not merge mochawesome results:', e);
    }
  },
};
