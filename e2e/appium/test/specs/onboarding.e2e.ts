import OnboardingPage from '../pageobjects/onboarding.page';
import AppHelper from '../utils/app.helper';
import ElementHelper from '../utils/element.helper';
import { HeadingTexts } from "../texts";

describe('Onboarding', () => {
  before(async () => {
    await AppHelper.launchApp();
  });

  it('should onboard', async () => {
    try {
      await ElementHelper.waitForElement('id', 'nextButton');
      await OnboardingPage.nextButton.click();

      await ElementHelper.waitForElement('id', 'nextButton');
      await OnboardingPage.nextButton.click();

      await ElementHelper.waitForElement('id', 'acceptRestrictionsButton');
      await OnboardingPage.accRestrButton.click();

      await OnboardingPage.denyLocation();

      await ElementHelper.waitForElement('id', 'dashboardScrollView');
      //await ElementHelper.expectText(ONBOARDING_heading);
      await ElementHelper.expectText(HeadingTexts.travelsearch);
    } catch (errMsg) {
      await AppHelper.screenshot('error_onboarding_should_onboard');
      throw errMsg;
    }
  });
});
