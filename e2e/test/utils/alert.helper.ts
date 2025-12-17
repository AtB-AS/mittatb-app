import Config from '../conf/config.js';
import ElementHelper from './element.helper.js';
import {$} from '@wdio/globals';

/**
 * Different helper methods related to alerts
 */
class AlertHelper {
  /**
   * Confirm button in pop-up alerts
   */
  get alertConfirm() {
    const id = `//*[@resource-id="android:id/button1"]`;
    return $(id);
  }

  /**
   * Title of the pop-up alert
   */
  get alertTitle() {
    const id = `//*[@resource-id="no.mittatb.${Config.appEnvironment()}:id/alert_title"]`;
    return $(id).getText();
  }

  /**
   * Cancel button in pop-up alerts
   */
  get alertCancel() {
    const id = `//*[@resource-id="android:id/button2"]`;
    return $(id);
  }

  /**
   * Cancel the system settings modal
   */
  async cancelSystemSettings() {
    const id = 'android:id/button1';
    const ref = `//*[@resource-id="${id}"]`;
    if (await ElementHelper.isElementExisting(id, 2)) {
      await $(ref).click();
    }
  }
}

export default new AlertHelper();
