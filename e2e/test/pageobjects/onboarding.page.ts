import ElementHelper from '../utils/element.helper.ts';
import AppHelper from '../utils/app.helper.ts';
import TokenPage from './token.page.js';

class OnboardingPage {
  /**
   * Use the app anonymously
   */
  get useAppAnonymously() {
    const reqId = `//*[@resource-id="useAppAnonymouslyButton"]`;
    return $(reqId);
  }

  /**
   * Accept limitations
   */
  get acceptLimitations() {
    const reqId = `//*[@resource-id="acceptLimitationsButton"]`;
    return $(reqId);
  }

  /**
   * Log in
   */
  get logIn() {
    const reqId = `//*[@resource-id="logInButton"]`;
    return $(reqId);
  }

  /**
   * Log in later
   */
  get logInLater() {
    const reqId = `//*[@resource-id="logInLaterButton"]`;
    return $(reqId);
  }

  /**
   * Description for log in to purchase
   */
  get logInPurchaseDescription() {
    const reqId = `//*[@resource-id="logInPurchaseDescription"]`;
    return $(reqId).getText();
  }

  /**
   * Next button on location screen
   */
  get locationPermission() {
    const reqId = `//*[@resource-id="locationWhenInUsePermissionButton"]`;
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
   * Deny use of location - and don't ask again
   * Possible other values:
   * - com.android.permissioncontroller:id/permission_allow_foreground_only_button
   * - com.android.permissioncontroller:id/permission_allow_one_time_button
   */
  async denyLocationAndDontAskAgain() {
    await ElementHelper.waitForElement(
      'id',
      'com.android.permissioncontroller:id/permission_deny_and_dont_ask_again_button',
    );
    await driver
      .$(
        '//*[@resource-id="com.android.permissioncontroller:id/permission_deny_and_dont_ask_again_button"]',
      )
      .click();
  }

  /**
   * Deny location prompt in onboarding
   */
  async denyLocationInOnboarding() {
    await ElementHelper.waitForElement(
      'id',
      'locationWhenInUsePermissionButton',
    );
    await this.locationPermission.click();
    await this.denyLocation();
  }

  /**
   * Tap through the onboarding
   */
  async skipOnboarding(testName: string = '') {
    try {
      // Onboarding: login (if enabled)
      // Note: Could also use Config.onboardingLoginEnabled() if settings are stable
      if (await ElementHelper.isElementExisting('useAppAnonymouslyButton', 2)) {
        await ElementHelper.waitForElement('id', 'useAppAnonymouslyButton');
        await this.useAppAnonymously.click();
        await ElementHelper.waitForElement('id', 'acceptLimitationsButton');
        await this.acceptLimitations.click();
      }

      // Onboarding: location
      await this.denyLocationInOnboarding();
    } catch (errMsg) {
      await AppHelper.screenshot(`error_${testName}_skipOnboarding`);
      throw errMsg;
    }
  }

  /**
   * Wait to see if token "onboarding" appears, i.e. token is used elsewhere, then change to this device
   * @param toggleToDevice whether to toggle to this device or not
   */
  async waitOnTokenOnboarding(toggleToDevice: boolean = true) {
    // Wait for potential token onboarding
    const tokenOnboardingAppear = await ElementHelper.isElementExisting(
      'travelTokenBox',
      10,
    );
    // Change to this device
    if (tokenOnboardingAppear) {
      await TokenPage.toggleToThisDevice(toggleToDevice);
    }
  }
}

export default new OnboardingPage();
