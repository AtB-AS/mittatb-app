import OnboardingPage from '../pageobjects/onboarding.page';
import AppHelper from '../utils/app.helper';
import ElementHelper from '../utils/element.helper';
import {HeadingTexts} from '../texts';

describe('Onboarding', () => {
  before(async () => {
    await AppHelper.launchApp();
  });

  /**
   * Should be onboarded and choose 'deny' on sharing location
   */
  it('should onboard', async () => {
    try {
      await ElementHelper.waitForElement('id', 'nextButton');
      await OnboardingPage.nextButton.click();
      await AppHelper.pause(2000);

      await ElementHelper.waitForElement('id', 'nextButton');
      await OnboardingPage.nextButton.click();

      await ElementHelper.waitForElement('id', 'acceptRestrictionsButton');
      await OnboardingPage.accRestrButton.click();

      // Location
      await OnboardingPage.denyLocation();

      await ElementHelper.waitForElement('id', 'dashboardScrollView');
      await ElementHelper.expectText(HeadingTexts.travelsearch);
    } catch (errMsg) {
      await AppHelper.screenshot('error_onboarding_should_onboard');
      throw errMsg;
    }
  });
});
