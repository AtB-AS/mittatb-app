import ElementHelper from '../utils/element.helper.js';
import {$} from '@wdio/globals';

class TravelSearchDetailsPage {
  /**
   * Get the travel time
   */
  get travelTime() {
    const reqId = `//*[@resource-id="travelTime"]`;
    return $(reqId);
  }

  /**
   * Check that the single leg returned is @mode
   * @param mode mode to check for (bike, foot)
   */
  async hasSingleLeg(mode: 'bike' | 'foot') {
    const legId_0 = `//*[@resource-id="legContainer0"]`;
    const legId_1 = `//*[@resource-id="legContainer1"]`;
    const modeId = `//*[@resource-id="${mode}Leg"]`;
    await ElementHelper.waitForElement('id', 'tripDetailsContentView');
    expect(await $(legId_1).isExisting()).toBe(false);
    return await $(legId_0).$(modeId).isExisting();
  }

  /**
   * Returns the start or end time for a leg at index
   * @param legIndex leg index
   * @param startOrEnd to get start or end time of a leg
   */
  async getTime(startOrEnd: 'start' | 'end', legIndex: number) {
    const searchResultId = `//*[@resource-id="legContainer${legIndex}"]`;
    const fromToPlaceId =
      startOrEnd == 'start'
        ? `//*[@resource-id="fromPlace"]`
        : `//*[@resource-id="toPlace"]`;
    const schTimeId = `//*[@resource-id="schTime"]`;
    const schCaTimeId = `//*[@resource-id="schCaTime"]`;
    const aimTimeId = `//*[@resource-id="aimTime"]`;
    const parentEl = await $(searchResultId).$(fromToPlaceId);

    // Either scheduled or aimed time
    if (await parentEl.$(aimTimeId).isExisting()) {
      return await parentEl.$(aimTimeId).getText();
    } else if (await parentEl.$(schCaTimeId).isExisting()) {
      return await parentEl.$(schCaTimeId).getText();
    }
    return await parentEl.$(schTimeId).getText();
  }

  /**
   * Returns the name of the start or end location for a leg
   * @param startOrEnd start or end location
   * @param legIndex leg index
   */
  async getLocation(startOrEnd: 'start' | 'end', legIndex: number) {
    const searchResultId = `//*[@resource-id="legContainer${legIndex}"]`;
    const fromToPlaceId =
      startOrEnd == 'start'
        ? `//*[@resource-id="fromPlaceName"]`
        : `//*[@resource-id="toPlaceName"]`;

    return await $(searchResultId).$(fromToPlaceId).getText();
  }
}

export default new TravelSearchDetailsPage();
