import Page from './page';
import ElementHelper from '../utils/element.helper';

class SearchPage extends Page {
  /**
   * define elements
   */
  get locationInput() {
    const reqId = `//*[@resource-id="locationSearchInput"]`;
    return $(reqId);
  }
  get searchResult() {
    const reqId = `//*[@resource-id="locationSearchItem0"]`;
    return $(reqId);
  }

  /**
   * define or overwrite page methods
   */
  async setSearchLocation(location: string) {
    await ElementHelper.waitForElement('id', 'locationSearchInput');
    await this.locationInput.setValue(location);
    await ElementHelper.waitForElement('id', 'locationSearchItem0');
    await this.searchResult.click();
  }
  async open() {
    return super.open();
  }
}

export default new SearchPage();
