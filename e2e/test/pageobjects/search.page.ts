import ElementHelper from '../utils/element.helper.ts';
import AppHelper from '../utils/app.helper.ts';

class SearchPage {
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
   * @param location location to search for
   */
  async setSearchLocation(location: string) {
    await ElementHelper.waitForElement('id', 'locationSearchInput');
    await this.locationInput.setValue(location);
    await ElementHelper.waitForElement('id', 'locationSearchItem0');
    await this.searchResult.click();
    await AppHelper.pause();
  }
}

export default new SearchPage();
