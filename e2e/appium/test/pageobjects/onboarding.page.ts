import Page from './page';
import ElementHelper from '../utils/element.helper';

class OnboardingPage extends Page {
  /**
   * define elements
   */
  get nextButton() {
    const reqId = `//*[@resource-id="nextButton"]`;
    return $(reqId);
  }
  get accRestrButton() {
    const reqId = `//*[@resource-id="acceptRestrictionsButton"]`;
    return $(reqId);
  }

  /**
   * define or overwrite page methods
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
  async skipOnboarding() {
    await ElementHelper.waitForElement('id', 'nextButton');
    await this.nextButton.click();
    await ElementHelper.waitForElement('id', 'nextButton');
    await this.nextButton.click();
    await ElementHelper.waitForElement('id', 'acceptRestrictionsButton');
    await this.accRestrButton.click();
    await this.denyLocation();
  }
  async open() {
    return super.open();
  }
}

export default new OnboardingPage();
