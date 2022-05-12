import {by, element, expect} from 'detox';
import { idExists } from "./commonHelpers";

// Step through the onboarding
export async function skipOnboarding() {
  const nextExists = await idExists(by.id('nextButton'))
  if (nextExists) {
    await element(by.id('nextButton')).tap();
    await element(by.id('nextButton')).tap();
    await expect(element(by.text('Travel assistant'))).toBeVisible();
  }
}
