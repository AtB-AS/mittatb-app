import ElementHelper from '../utils/element.helper';
import AppHelper from '../utils/app.helper';

class OnboardingPage {
  /**
   * Next button on welcome screen
   */
  get nextButtonOnboardingWelcome() {
    const reqId = `//*[@resource-id="nextButtonOnboardingWelcome"]`;
    return $(reqId);
  }

  /**
   * Next button on intercom screen
   */
  get nextButtonIntercomOnboarding() {
    const reqId = `//*[@resource-id="nextButtonIntercomOnboarding"]`;
    return $(reqId);
  }

  /**
   * Next button on notifications screen
   */
  get nextButtonNotificationOnboarding() {
    const reqId = `//*[@resource-id="nextButtonNotificationOnboarding"]`;
    return $(reqId);
  }

  /**
   * Next button on location screen
   */
  get nextButtonLocationOnboarding() {
    const reqId = `//*[@resource-id="locationWhenInUsePermissionButton"]`;
    return $(reqId);
  }

  /**
   * Accept restrictions
   */
  get accRestrButton() {
    const reqId = `//*[@resource-id="acceptRestrictionsButton"]`;
    return $(reqId);
  }

  /**
   * Deny use of location
   */
  async denyLocation() {
    await ElementHelper.waitForElement(
      'id',
      'com.android.permissioncontroller:id/permission_deny_button',
    );
    await driver
      .$(
        '//*[@resource-id="com.android.permissioncontroller:id/permission_deny_button"]',
      )
      .click();
  }

  /**
   * Tap through the onboarding
   */
  async skipOnboarding(testName: string = '') {
    try {
      await ElementHelper.waitForElement('id', 'nextButtonOnboardingWelcome');
      await this.nextButtonOnboardingWelcome.click();
      await AppHelper.pause(10000, true);
      await ElementHelper.waitForElement('id', 'nextButtonIntercomOnboarding');
      await this.nextButtonIntercomOnboarding.click();
      await ElementHelper.waitForElement('id', 'acceptRestrictionsButton');
      await this.accRestrButton.click();
      await ElementHelper.waitForElement(
        'id',
        'locationWhenInUsePermissionButton',
      );
      await this.nextButtonLocationOnboarding.click();
      await this.denyLocation();
      //NOTE! Temporarily disabled
      /*
      await AppHelper.pause(3000, true);
      await ElementHelper.waitForElement(
        'id',
        'nextButtonNotificationOnboarding',
      );
      await this.nextButtonNotificationOnboarding.click();
       */
    } catch (errMsg) {
      await AppHelper.screenshot(`error_${testName}_skipOnboarding`);
      throw errMsg;
    }
  }
}

export default new OnboardingPage();
