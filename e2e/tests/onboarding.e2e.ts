import {device, by, element, expect} from 'detox';
import setLocation from '../utils';

describe('Onboarding', () => {
  beforeAll(async () => {
    await device.launchApp({
      permissions: {
        location: 'inuse',
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
    await element(by.text('Next')).tap();
    await expect(element(by.text('Help us make the app better'))).toBeVisible();
  });

  it('should assistant view after onboarding', async () => {
    await element(by.text('Start using the app')).tap();
    await expect(element(by.text('Travel assistant'))).toBeVisible();
  });
});
