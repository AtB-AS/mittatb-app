import {by, element, expect} from 'detox';
import {idExists} from './commonHelpers';

// Step through the onboarding
export async function skipOnboarding() {
  const nextExists = await idExists(by.id('nextButton'));
  if (nextExists) {
    await element(by.id('nextButton')).atIndex(0).tap();
    await element(by.id('nextButton')).atIndex(0).tap();
    await element(by.id('acceptRestrictionsButton')).tap();
    await expect(element(by.text('Travel search'))).toBeVisible();
  }
}
