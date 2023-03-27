import Page from './page';
import ElementHelper from '../utils/element.helper';

class SearchPage extends Page {
  /**
   * The input field for searching
   */
  get locationInput() {
    const reqId = `//*[@resource-id="locationSearchInput"]`;
    return $(reqId);
  }

  /**
   * Return the first search result
   */
  get searchResult() {
    const reqId = `//*[@resource-id="locationSearchItem0"]`;
    return $(reqId);
  }

  /**
   * Search for a location
   * @param: location: location to search for
   */
  async setSearchLocation(location: string) {
    await ElementHelper.waitForElement('id', 'locationSearchInput');
    await this.locationInput.setValue(location);
    await ElementHelper.waitForElement('id', 'locationSearchItem0');
    await this.searchResult.click();
  }
}

export default new SearchPage();
