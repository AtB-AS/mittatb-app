import AppHelper from '../utils/app.helper.ts';
import {parseBoolean} from '../utils/utils.ts';

class PrivacyPage {
  /**
   * Checks if data collection toggle is checked or not
   */
  async dataCollectionIsEnabled() {
    const reqId = `//*[@resource-id="toggleCollectData"]`;
    return parseBoolean(await $(reqId).getAttribute('checked'));
  }

  /**
   * Toggle (enable/disable) data collection
   */
  async toggleDataCollection() {
    const reqId = `//*[@resource-id="toggleCollectData"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Check if the missing permission info exists or not
   * @param exists is true if exists, and false if not (default: true)
   */
  async permissionRequiredInfoExists(exists: boolean = true) {
    const reqId = `//*[@resource-id="messageBox"]`;
    const titleId = `//*[@resource-id="title"]`;
    if (exists) {
      await expect(await $(reqId)).toExist();
      await expect(await $(reqId).$(titleId).getText()).toContain(
        'Permission required',
      );
    } else {
      await expect(await $(reqId)).not.toExist();
    }
  }
}

export default new PrivacyPage();
