import {by, element, expect} from "detox";

// Step through the onboarding
export async function skipOnboarding(){
    await element(by.text('Next')).tap();
    await element(by.text('Start using the app')).tap();
    await expect(element(by.text('Travel assistant'))).toBeVisible();
}