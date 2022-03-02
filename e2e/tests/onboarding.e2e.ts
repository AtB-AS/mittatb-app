import {device, by, element, expect} from 'detox';
import setLocation from '../utils';

describe('Onboarding', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        location: 'inuse',
      },
      languageAndLocale: {
        language: 'en',
        locale: 'US',
      },
    });
    await setLocation(62.4305, 9.3951);
  });

  // beforeEach(async () => {
  //   await device.reloadReactNative();
  // });

  it('should have welcome screen', async () => {
    await expect(element(by.text('Welcome to the AtB app'))).toBeVisible();
  });

  it('should show help us make app better after next', async () => {
    await element(by.id('nextButton')).tap();
    await expect(element(by.text('Help us make the app better'))).toBeVisible();
  });

  it('should assistant view after onboarding', async () => {
    await element(by.id('nextButton')).tap();
    await expect(element(by.text('Travel assistant'))).toBeVisible();
  });

  it('should be able to search and scroll', async () => {
    await element(by.id('searchFromButton')).tap();
    await element(by.id('locationSearchInput')).replaceText('Orkanger');
    await element(by.id('locationSearchItem0')).tap();

    await element(by.id('searchToButton')).tap();
    await element(by.id('locationSearchInput')).replaceText('Prinsens gate');
    await element(by.id('locationSearchItem0')).tap();

    await element(
      by.type('RCTScrollView').withDescendant(by.id('assistantScrollView')),
    ).scrollTo('bottom');
  });
});
