import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.ts';

class DepartureDetailPage {
  /**
   * Get all passed legs
   */
  get passedLegs() {
    const passedId = `//*[@resource-id="legType_passed"]`;
    return $$(passedId);
  }

  /**
   * Expand or hide intermediate stops
   */
  async expandAndHideIntermediateStops() {
    const interId = `//*[@resource-id="intermediateStops"]`;
    await $(interId).click();
    await AppHelper.pause(1000);
  }

  /**
   * Return the public code
   */
  async getPublicCode() {
    const publicCodeId = `//*[@resource-id="PublicCode"]`;
    return $(publicCodeId).getText();
  }

  /**
   * Return the line name
   */
  async getLineName() {
    const lineNameId = `//*[@resource-id="lineName"]`;
    return $(lineNameId).getText();
  }

  /**
   * Return the quay name
   * @param legType 'passed' or 'trip'
   * @param legIndex index of the leg
   */
  async getQuayName(legType: 'passed' | 'trip', legIndex: number = 0) {
    const legId = `//*[@resource-id="legType_${legType}"]`;
    const quayNameId = `//*[@resource-id="quayName"]`;
    const el = await $$(legId)[legIndex].$(quayNameId);
    return el.getText();
  }

  /**
   * Click the quay
   * @param legType 'passed' or 'trip'
   * @param legIndex index of the leg
   */
  async tapQuay(legType: 'passed' | 'trip', legIndex: number = 0) {
    const legId = `//*[@resource-id="legType_${legType}"]`;
    const quayNameId = `//*[@resource-id="quayName"]`;
    await $$(legId)[legIndex].$(quayNameId).click();
    await AppHelper.pause(500);
    await ElementHelper.waitForElement('id', 'quaySection');
    await ElementHelper.waitForElement('id', 'estimatedCallItem');
  }
}

export default new DepartureDetailPage();
