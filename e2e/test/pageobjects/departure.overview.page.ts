import Page from './page';
import AppHelper from '../utils/app.helper';
import ElementHelper from '../utils/element.helper';

class DepartureOverviewPage extends Page {
  /**
   * The 'all stops' button
   */
  async showAllQuays() {
    const buttonId = `//*[@resource-id="allStopsSelectionButton"]`;
    await $(buttonId).click();
    await ElementHelper.waitForElement('id', 'quaySection0');
    await ElementHelper.waitForElement('id', 'departureItem0');
  }

  /**
   * The single quay button
   * @param quayIndex: index for the quay button
   */
  async showQuay(quayIndex: number = 0) {
    const buttonId = `//*[@resource-id="quaySelectionButton"]`;
    await $$(buttonId)[quayIndex].click();
    await AppHelper.pause(500);
    await ElementHelper.waitForElement('id', 'quaySection');
    await ElementHelper.waitForElement('id', 'departureItem0');
  }

  /**
   * Get the given departure for the given quay
   * @param quayIndex: index for the quay, default: first
   * @param departureIndex: index for the departure, default: first
   */
  async getDeparture(quayIndex: number = 0, departureIndex: number = 0) {
    const quayId = `//*[@resource-id="quaySection${quayIndex}"]`;
    const depId = `//*[@resource-id="departureItem${departureIndex}"]`;
    return $(quayId).$(depId);
  }

  /**
   * Hide or expand (depending on the state) departures section for a given quay
   * @param quayIndex: index for the quay, default: first
   */
  async hideExpandDeps(quayIndex: number = 0) {
    const hideId = `//*[@resource-id="quaySection${quayIndex}HideAction"]`;
    await $(hideId).click();
    await AppHelper.pause(1000);
  }

  /**
   * Return the public code
   * @param quayIndex: index of the quay
   * @param depIndex: index of the departure
   */
  async getLinePublicCode(quayIndex: number = 0, depIndex: number = 0) {
    const quayId = `//*[@resource-id="quaySection${quayIndex}"]`;
    const publicCodeId = `//*[@resource-id="departureItem${depIndex}PublicCode"]`;
    return $(quayId).$(publicCodeId).getText();
  }

  /**
   * Return the line name
   * @param quayIndex: index of the quay
   * @param depIndex: index of the departure
   */
  async getLineName(quayIndex: number = 0, depIndex: number = 0) {
    const quayId = `//*[@resource-id="quaySection${quayIndex}"]`;
    const lineNameId = `//*[@resource-id="departureItem${depIndex}Name"]`;
    return $(quayId).$(lineNameId).getText();
  }

  /**
   * Get number of departures
   * @param quayIndex: index of quay id overview or empty if quay-view
   */
  async getNumberOfDepartures(quayIndex: string = '') {
    const quayId = `//*[@resource-id="quaySection${quayIndex}"]`;
    await ElementHelper.waitForElement('id', `quaySection${quayIndex}`);
    let count = 0;
    // check departure items with a max to avoid endless loop
    // considers only visible element
    while (count < 20) {
      const depId = `//*[@resource-id="departureItem${count}"]`;
      if (await $(quayId).$(depId).isExisting()) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  /**
   * Tap the 'show more departures' button for a quay
   * @param: quayIndex: index for the quay
   */
  async showMoreDepartures(quayIndex: number = 0) {
    const moreId = `//*[@resource-id="quaySection${quayIndex}More"]`;
    await $(moreId).click();
    await AppHelper.pause(500);
    await ElementHelper.waitForElement('id', 'quaySection');
    await ElementHelper.waitForElement('id', 'departureItem0');
  }
}

export default new DepartureOverviewPage();
