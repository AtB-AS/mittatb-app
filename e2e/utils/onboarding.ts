import {by, element, expect} from 'detox';

// Step through the onboarding
export async function skipOnboarding() {
  await element(by.id('nextButton')).tap();
  await element(by.id('nextButton')).tap();
  await expect(element(by.text('Travel assistant'))).toBeVisible();
}
