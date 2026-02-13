import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.ts';

class DepartureOverviewPage {
  /**
   * The 'all stops' button
   */
  async showAllQuays() {
    const buttonId = `//*[@resource-id="allStopsSelectionButton"]`;
    await $(buttonId).click();
    await ElementHelper.waitForElement('id', 'quay0');
    await ElementHelper.waitForElement('id', 'quay0CallItem');
  }

  /**
   * The single quay button
   * @param quayIndex index for the quay button
   */
  async showQuay(quayIndex: number = 0) {
    const buttonId = `//*[@resource-id="quaySelectionButton"]`;
    await $$(buttonId)[quayIndex].click();
    await AppHelper.pause(500);
    await ElementHelper.waitForElement('id', 'quay');
    await ElementHelper.waitForElement('id', 'quayCallItem');
  }

  /**
   * Get the given departure for the given quay
   * @param quayIndex index for the quay, default: first
   * @param departureIndex index for the departure, default: first
   */
  async getDeparture(quayIndex: number = 0, departureIndex: number = 0) {
    const depId = `//*[@resource-id="quay${quayIndex}CallItem"]`;
    return $$(depId)[departureIndex];
  }

  /**
   * Get the given departure for the given quay
   * @param quayIndex index for the quay, default: first
   * @param departureIndex index for the departure, default: first
   */
  async openDeparture(quayIndex: number = 0, departureIndex: number = 0) {
    const depId = `//*[@resource-id="quay${quayIndex}CallItem"]`;
    await ElementHelper.waitForElement('id', `quay${quayIndex}CallItem`);
    await $$(depId)[departureIndex].click();
    await ElementHelper.waitForElement('id', 'departureDetailsContentView');
  }

  /**
   * Hide or expand (depending on the state) departures section for a given quay
   * @param quayIndex index for the quay, default: first
   */
  async hideExpandDeps(quayIndex: number = 0) {
    const hideId = `//*[@resource-id="quay${quayIndex}HideAction"]`;
    await $(hideId).click();
    await AppHelper.pause(1000);
  }

  /**
   * Return the public code
   * @param quayIndex index of the quay
   * @param depIndex index of the departure
   */
  async getLinePublicCode(quayIndex: number = 0, depIndex: number = 0) {
    const elemId = `//*[@resource-id="quay${quayIndex}CallItem"]`;
    const pcId = `//*[@resource-id="publicCode"]`;
    return $$(elemId)[depIndex].$(pcId).getText();
  }

  /**
   * Return the line name
   * @param quayIndex index of the quay
   * @param depIndex index of the departure
   */
  async getLineName(quayIndex: number = 0, depIndex: number = 0) {
    const elemId = `//*[@resource-id="quay${quayIndex}CallItem"]`;
    const lineId = `//*[@resource-id="lineName"]`;
    return $$(elemId)[depIndex].$(lineId).getText();
  }

  /**
   * Get number of departures
   * @param quayIndex index of quay id overview or empty if quay-view
   */
  async getNumberOfDepartures(quayIndex: string = '') {
    const depId = `//*[@resource-id="quay${quayIndex}CallItem"]`;
    await ElementHelper.waitForElement('id', `quay${quayIndex}CallItem`);
    // considers only visible element
    return await $$(depId).length;
  }

  /**
   * Tap the 'show more departures' button for a quay
   * @param quayIndex index for the quay
   */
  async showMoreDepartures(quayIndex: number = 0) {
    await ElementHelper.waitForElement('id', `quay${quayIndex}More`);
    const moreId = `//*[@resource-id="quay${quayIndex}More"]`;
    await $(moreId).click();
    await AppHelper.pause(500);
    await ElementHelper.waitForElement('id', 'quay');
    await ElementHelper.waitForElement('id', 'quayCallItem');
  }
}

export default new DepartureOverviewPage();
