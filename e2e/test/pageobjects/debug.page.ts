import AppHelper from "../utils/app.helper.js";
import {$} from "@wdio/globals";

class DebugPage {
  /**
   * Check if the mobile token id exists
   */
  get hasMobileTokenId() {
    const reqId = `//*[@resource-id="tokenId"]`;
    return $(reqId).isExisting();
  }

  /**
   * Scroll down to the mobile token section
   */
  async scrollToMobileToken() {
    await AppHelper.scrollDownUntilId(
        'debugInfoScrollView',
        'mobileTokenDebug',
    );
  }

  /**
   * Open the remote token expandable
   */
  async showRemoteTokens() {
    await AppHelper.scrollDown('debugInfoScrollView');
    const reqId = `//*[@resource-id="remoteTokenExpandable"]`;
    await $(reqId).click();
  }

  /**
   * Remove all remote tokens (including the current on the device)
   */
  async removeAllRemoteTokens() {
    await AppHelper.scrollDown('debugInfoScrollView');
    //const len = await $$(buttonId).length;
    for (let i = 0; i < 10; i++) {
      const buttonId = `//*[@resource-id="removeRemoteToken${i}"]`;
      const buttonExists = await $(buttonId).isExisting();
      if (buttonExists) {
        await $(buttonId).click()
        await AppHelper.scrollDown('debugInfoScrollView');
      } else {
        break
      }
    }
  }

  /**
   * Open the chosen section
   * @param section section to open
   */
  async open(section: string) {
    const reqId = `//*[@resource-id="${section}Debug"]`;
    await $(reqId).click();
  }

  /**
   * Get the mobile token status
   */
  async getMobileTokenStatus() {
    const reqId = `//*[@resource-id="tokenStatus"]`;
    return (await $(reqId).getText()).split(': ')[1];
  }
}

export default new DebugPage();
