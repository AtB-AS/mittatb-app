import AppHelper from '../utils/app.helper.ts';
import {parseBoolean} from '../utils/utils.ts';

class MyProfilePage {
  /**
   * Open a setting from my profile
   * @param setting the setting to open
   */
  async openSetting(setting: string) {
    const reqId = `//*[@resource-id="${setting}Button"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Checks if notification toggle is checked or not
   * @param type type of notification to check
   */
  async notificationIsEnabled(type: string) {
    const reqId = `//*[@resource-id="${type}Toggle"]`;
    return parseBoolean(await $(reqId).getAttribute('checked'));
  }
}

export default new MyProfilePage();
