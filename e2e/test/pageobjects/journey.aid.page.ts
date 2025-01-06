import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.js';

class JourneyAidPage {
  /**
   * Close the journey aid view
   */
  async closeJourneyAid() {
    const reqId = `//*[@resource-id="closeJourneyAidButton"]`;
    await $(reqId).click();
    await AppHelper.pause();
    await ElementHelper.waitForElement('id', 'departureDetailsContentView');
  }
}

export default new JourneyAidPage();
