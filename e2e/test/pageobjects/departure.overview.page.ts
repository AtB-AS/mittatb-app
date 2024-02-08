import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.ts';

class DepartureOverviewPage {
  /**
   * The 'all stops' button
   */
  async showAllQuays() {
    const buttonId = `//*[@resource-id="allStopsSelectionButton"]`;
    await $(buttonId).click();
    await ElementHelper.waitForElement('id', 'quaySection0');
    await ElementHelper.waitForElement('id', 'estimatedCallItem');
  }

  /**
   * The single quay button
   * @param quayIndex index for the quay button
   */
  async showQuay(quayIndex: number = 0) {
    const buttonId = `//*[@resource-id="quaySelectionButton"]`;
    await $$(buttonId)[quayIndex].click();
    await AppHelper.pause(500);
    await ElementHelper.waitForElement('id', 'quaySection');
    await ElementHelper.waitForElement('id', 'estimatedCallItem');
  }

  /**
   * Get the given departure for the given quay
   * @param quayIndex index for the quay, default: first
   * @param departureIndex index for the departure, default: first
   */
  async getDeparture(quayIndex: number = 0, departureIndex: number = 0) {
    const quayId = `//*[@resource-id="quaySection${quayIndex}"]`;
    const depId = `//*[@resource-id="estimatedCallItem"]`;
    return $(quayId).$$(depId)[departureIndex];
  }

  /**
   * Get the given departure for the given quay
   * @param quayIndex index for the quay, default: first
   * @param departureIndex index for the departure, default: first
   */
  async openDeparture(quayIndex: number = 0, departureIndex: number = 0) {
    const quayId = `//*[@resource-id="quaySection${quayIndex}"]`;
    const depId = `//*[@resource-id="estimatedCallItem"]`;
    await ElementHelper.waitForElement('id', `quaySection${quayIndex}`);
    await ElementHelper.waitForElement('id', 'estimatedCallItem');
    await $(quayId).$$(depId)[departureIndex].click();
  }

  /**
   * Hide or expand (depending on the state) departures section for a given quay
   * @param quayIndex index for the quay, default: first
   */
  async hideExpandDeps(quayIndex: number = 0) {
    const hideId = `//*[@resource-id="quaySection${quayIndex}HideAction"]`;
    await $(hideId).click();
    await AppHelper.pause(1000);
  }

  /**
   * Return the public code
   * @param quayIndex index of the quay
   * @param depIndex index of the departure
   */
  async getLinePublicCode(quayIndex: number = 0, depIndex: number = 0) {
    const quayId = `//*[@resource-id="quaySection${quayIndex}"]`;
    const publicCodeId = `//*[@resource-id="estimatedCallItemPublicCode"]`;
    return $(quayId).$$(publicCodeId)[depIndex].getText();
  }

  /**
   * Return the line name
   * @param quayIndex index of the quay
   * @param depIndex index of the departure
   */
  async getLineName(quayIndex: number = 0, depIndex: number = 0) {
    const quayId = `//*[@resource-id="quaySection${quayIndex}"]`;
    const lineNameId = `//*[@resource-id="estimatedCallItemLineName"]`;
    return $(quayId).$$(lineNameId)[depIndex].getText();
  }

  /**
   * Get number of departures
   * @param quayIndex index of quay id overview or empty if quay-view
   */
  async getNumberOfDepartures(quayIndex: string = '') {
    const quayId = `//*[@resource-id="quaySection${quayIndex}"]`;
    const depId = `//*[@resource-id="estimatedCallItem"]`;
    await ElementHelper.waitForElement('id', `quaySection${quayIndex}`);
    await ElementHelper.waitForElement('id', `estimatedCallItem`);
    // considers only visible element
    return await $(quayId).$$(depId).length;
  }

  /**
   * Tap the 'show more departures' button for a quay
   * @param quayIndex index for the quay
   */
  async showMoreDepartures(quayIndex: number = 0) {
    await ElementHelper.waitForElement('id', `quaySection${quayIndex}More`);
    const moreId = `//*[@resource-id="quaySection${quayIndex}More"]`;
    await $(moreId).click();
    await AppHelper.pause(500);
    await ElementHelper.waitForElement('id', 'quaySection');
    await ElementHelper.waitForElement('id', 'estimatedCallItem');
  }
}

export default new DepartureOverviewPage();
