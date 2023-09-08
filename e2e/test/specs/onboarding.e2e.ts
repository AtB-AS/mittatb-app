import OnboardingPage from '../pageobjects/onboarding.page';
import AppHelper from '../utils/app.helper';
import ElementHelper from '../utils/element.helper';
import {HeadingTexts} from '../texts';

//https://github.com/AtB-AS/kundevendt/issues/4157#issuecomment-1707973260
xdescribe('Onboarding', () => {
  before(async () => {
    //await AppHelper.launchApp();
    await AppHelper.waitOnLoadingScreen()
    await AppHelper.pause(5000, true);
  });

  /**
   * Should be onboarded and choose 'deny' on sharing location
   */
  it('should onboard', async () => {
    try {
      await ElementHelper.waitForElement('id', 'nextButtonOnboardingWelcome');
      await OnboardingPage.nextButtonOnboardingWelcome.click();
      await AppHelper.pause(10000, true);

      await ElementHelper.waitForElement('id', 'nextButtonIntercomOnboarding');
      await OnboardingPage.nextButtonIntercomOnboarding.click();

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
