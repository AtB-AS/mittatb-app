import OnboardingPage from '../pageobjects/onboarding.page';
import AppHelper from '../utils/app.helper';
import ElementHelper from '../utils/element.helper';

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

      await ElementHelper.waitForElement('text', 'Travel search');
      await expect(
        ElementHelper.getElementText('Travel search'),
      ).toHaveTextContaining('Travel search');
    } catch (errMsg) {
      await AppHelper.screenshot('error_onboarding_should_onboard');
      throw errMsg;
    }
  });
});
