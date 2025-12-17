import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.js';
import AlertHelper from '../utils/alert.helper.js';

class ProfilePage {
  /**
   * Get the login button
   */
  get login() {
    const reqId = `//*[@resource-id="loginButton"]`;
    return $(reqId);
  }

  /**
   * Get the logged in with info
   */
  get loggedInWithInfo() {
    const reqId = `//*[@resource-id="loggedInWith"]`;
    return $(reqId).getText();
  }

  /**
   * Open an option from profile
   * @param option the setting to open
   */
  async open(option: string) {
    const reqId = `//*[@resource-id="${option}Button"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Log out
   */
  async logout() {
    await AppHelper.scrollDownUntilId('profileHomeScrollView', 'logoutButton');
    const reqId = `//*[@resource-id="logoutButton"]`;
    await $(reqId).click();

    // Confirm alert
    await ElementHelper.waitForAlert();
    await AlertHelper.alertConfirm.click();
    await AppHelper.pause(2000);
  }
}

export default new ProfilePage();
