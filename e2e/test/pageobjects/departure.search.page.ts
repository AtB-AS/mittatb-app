import Page from './page';
import ElementHelper from '../utils/element.helper';

class DepartureSearchPage extends Page {
  /**
   * Search from
   */
  get searchFrom() {
    const reqId = `//*[@resource-id="searchFromButton"]`;
    return $(reqId);
  }

  /**
   * Click the given stop place
   * @param stopPlace: name of the stop place
   */
  async chooseStopPlace(stopPlace: string) {
    await ElementHelper.waitForElement('id', 'nearbyStopsContainerView');
    // Choose requested stop place
    for (let i = 0; i < 10; i++) {
      const stopId = `//*[@resource-id="stopPlaceItem${i}Name"]`;
      if ((await $(stopId).getText()) === stopPlace) {
        await $(stopId).click();
        break;
      }
    }
    await ElementHelper.waitForElement('id', 'departuresContentView');
  }
}

export default new DepartureSearchPage();
