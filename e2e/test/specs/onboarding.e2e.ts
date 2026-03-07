import OnboardingPage from '../pageobjects/onboarding.page.ts';
import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.ts';

describe('Onboarding', () => {
  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await AppHelper.pause(5000, true);
  });

  /**
   * Should be onboarded and choose 'deny' on sharing location
   */
  it('should onboard', async () => {
    try {
      await ElementHelper.waitForElement('id', 'useAppAnonymouslyButton');
      await OnboardingPage.useAppAnonymously.click();

      await ElementHelper.waitForElement('id', 'acceptLimitationsButton');
      await OnboardingPage.acceptLimitations.click();

      // Location
      await ElementHelper.waitForElement(
        'id',
        'locationWhenInUsePermissionButton',
      );
      await OnboardingPage.locationPermission.click();
      await OnboardingPage.denyLocation();

      await ElementHelper.waitForElement('id', 'dashboardScrollView');
      await ElementHelper.expectText('Travel');
    } catch (errMsg) {
      await AppHelper.screenshot('error_onboarding_should_onboard');
      throw errMsg;
    }
  });
});
