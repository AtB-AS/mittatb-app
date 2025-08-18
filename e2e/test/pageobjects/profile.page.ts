import AppHelper from '../utils/app.helper.ts';

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
}

export default new ProfilePage();
