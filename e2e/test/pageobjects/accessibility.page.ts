import AppHelper from '../utils/app.helper.ts';

class AccessibilityPage {
  /**
   * Toggle (enable/disable) journey aid in departures
   */
  async toggleJourneyAid() {
    const reqId = `//*[@resource-id="toggleTravelAid"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }
}

export default new AccessibilityPage();
