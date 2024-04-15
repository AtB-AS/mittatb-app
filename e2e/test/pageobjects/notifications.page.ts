import AppHelper from '../utils/app.helper.ts';
import {parseBoolean} from '../utils/utils.ts';

class NotificationsPage {
  /**
   * Checks if notification toggle is checked or not
   * @param type type of notification to check
   */
  async notificationIsEnabled(type: string) {
    const reqId = `//*[@resource-id="${type}Toggle"]`;
    return parseBoolean(await $(reqId).getAttribute('checked'));
  }

  /**
   * Toggle (enable/disable) data collection
   */
  async toggleEmailNotifications() {
    const reqId = `//*[@resource-id="emailToggle"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Check if the info of missing requirements like login and email exists or not
   * @param exists is true if exists, and false if not (default: true)
   */
  async missingLoginAndEmailInfoExists(exists: boolean = true) {
    const reqId = `//*[@resource-id="messageBox"]`;
    const titleId = `//*[@resource-id="title"]`;
    if (exists) {
      await expect(await $(reqId)).toExist();
      await expect(await $$(reqId)[0].$(titleId).getText()).toContain(
        'Login required',
      );
      await expect(await $$(reqId)[1].$(titleId).getText()).toContain(
        'E-mail missing',
      );
    } else {
      await expect(await $(reqId)).not.toExist();
    }
  }
}

export default new NotificationsPage();
