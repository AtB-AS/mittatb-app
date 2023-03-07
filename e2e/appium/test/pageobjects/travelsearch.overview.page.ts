import Page from './page';
import ElementHelper from '../utils/element.helper';
import AppHelper from '../utils/app.helper';

class TravelSearchOverviewPage extends Page {
  /**
   * define elements
   */
  get firstTripResult() {
    const reqId = `//*[@resource-id="tripSearchSearchResult0"]`;
    return $(reqId);
  }

  /**
   * define or overwrite page methods
   */
  async openFirstSearchResult() {
    await ElementHelper.waitForElement('id', `tripSearchSearchResult0`);
    await this.firstTripResult.click();
    await ElementHelper.waitForElement('id', `tripDetailsContentView`);
  }
  async confirmOnboarding() {
    const id = `//*[@resource-id="filterOnboardingConfirmButton"]`;
    await AppHelper.pause(2000);
    const exists = await $(id).isExisting();
    if (exists) {
      await $(id).click();
    }
  }
  async open() {
    return super.open();
  }
}
export default new TravelSearchOverviewPage();
