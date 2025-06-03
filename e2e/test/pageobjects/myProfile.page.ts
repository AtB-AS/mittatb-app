import AppHelper from '../utils/app.helper.ts';

class MyProfilePage {
  /**
   * Open a setting from profile
   * @param setting the setting to open
   */
  async openSetting(setting: string) {
    const reqId = `//*[@resource-id="${setting}Button"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }
}

export default new MyProfilePage();
