import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';

describe('Auth', () => {
  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('myProfile');
    await AppHelper.pause(5000, true);
  });
  beforeEach(async () => {
    await NavigationHelper.tapMenu('profile');
    await NavigationHelper.tapMenu('profile');
    await ElementHelper.waitForElement('text', 'Profile');
  });

  it('should login', async () => {
    try {
      const login = `//*[@resource-id="loginButton"]`;
      await $(login).click();
      await ElementHelper.waitForElement('id', 'chooseLoginPhoneButton');

      const phone = `//*[@resource-id="chooseLoginPhoneButton"]`;
      await $(phone).click();
      await ElementHelper.waitForElement('id', 'loginPhoneInput');

      const input = `//*[@resource-id="loginPhoneInput"]`;
      //await $(input).click();
      await $(input).setValue('92222222');
      const confirm = `//*[@resource-id="sendCodeButton"]`;
      await $(confirm).click();
      await AppHelper.pause(1000);
      await ElementHelper.waitForElement('id', 'loginConfirmCodeInput');

      const input2 = `//*[@resource-id="loginConfirmCodeInput"]`;
      //await $(input2).click();
      await $(input2).setValue('123456');
      const confirm2 = `//*[@resource-id="submitButton"]`;
      await $(confirm2).click();
      await AppHelper.pause(1000);
      await ElementHelper.waitForElement('text', 'Travel search');
      await AppHelper.pause(10000);

    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_auth_test',
      );
      throw errMsg;
    }
  });
});
