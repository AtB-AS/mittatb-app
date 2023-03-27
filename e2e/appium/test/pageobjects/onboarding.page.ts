import Page from './page';
import ElementHelper from '../utils/element.helper';
import AppHelper from '../utils/app.helper';

class OnboardingPage extends Page {
  /**
   * Next button
   */
  get nextButton() {
    const reqId = `//*[@resource-id="nextButton"]`;
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
  async skipOnboarding() {
    await ElementHelper.waitForElement('id', 'nextButton');
    await this.nextButton.click();
    await AppHelper.pause(2000);
    await ElementHelper.waitForElement('id', 'nextButton');
    await this.nextButton.click();
    await ElementHelper.waitForElement('id', 'acceptRestrictionsButton');
    await this.accRestrButton.click();
    await this.denyLocation();
  }
}

export default new OnboardingPage();
