import {device} from 'detox';
import setLocation from '../utils';
import {tapById} from '../utils/interactionHelpers';
import {expectToBeVisibleByText} from '../utils/expectHelpers';

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

  it('should have welcome screen', async () => {
    await expectToBeVisibleByText('Welcome to the AtB app');
  });

  it('should show help us make app better after next', async () => {
    await tapById('nextButton');
    await expectToBeVisibleByText('Help us make the app better');
  });

  it('should assistant view after onboarding', async () => {
    await tapById('nextButton');
    await expectToBeVisibleByText('Travel assistant');
  });
});
