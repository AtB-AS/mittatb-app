import ElementHelper from '../utils/element.helper.ts';
import AppHelper from '../utils/app.helper.ts';
import {$} from '@wdio/globals';

class TravelSearchFilterPage {
  /**
   * Return the selected filter button (when transport modes are removed from trip search)
   */
  get selectedFilterButton() {
    const reqId = `//*[@resource-id="selectedFilterButton"]`;
    return $(reqId);
  }

  /**
   * Return number of filters available (including the 'all' option)
   */
  get numberOfFilters() {
    const reqId = `//*[@resource-id="toggleItem"]`;
    return $$(reqId).length;
  }

  /**
   * Open the time picker on the travel search results
   */
  async openTravelSearchTimePicker() {
    const reqId = `//*[@resource-id="dashboardDateTimePicker"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('text', `Leave at`);
  }

  /**
   * Choose what to base the search on
   * @param basedOn what to base on (Now | Departure | Arrival)
   */
  async chooseSearchBasedOn(basedOn: 'Now' | 'Departure' | 'Arrival') {
    const reqId = `//*[@text="Leave at"]`;
    await $(reqId).click();
    if (basedOn !== 'Now') {
      await ElementHelper.waitForElement('id', `timePicker`);
      //id: no.mittatb.debug:id/pickerWrapper
    }
  }

  /**
   * Open the travel search filter
   */
  async openFilter() {
    const reqId = `//*[@resource-id="filterButton"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('id', `filterView`);
  }

  /**
   * Toggle on of the filters (or the 'all' option)
   * @param type type of filter to toggle (default: allModes)
   */
  async toggleTransportModeFilter(type: string = 'allModes') {
    const reqId = `//*[@resource-id="${type}Toggle"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Check if filter is toggled on/off
   * @param type type of filter to check (default: allModes)
   * @return string "true" | "false"
   */
  async transportModeFilterIsChecked(type: string = 'allModes') {
    const reqId = `//*[@resource-id="${type}Toggle"]`;
    return await $(reqId).getAttribute('checked');
  }

  /**
   * Set the walk speed
   * @param speed type of walk speed to use in search
   */
  async setWalkSpeed(speed: 'slow' | 'normal' | 'fast') {
    const reqId = `//*[@resource-id="${speed}Button"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Check that the given walk speed is enabled
   * @param speed type of walk speed
   */
  async walkSpeedIsEnabled(speed: 'slow' | 'normal' | 'fast') {
    const reqId = `//*[@resource-id="${speed}Button"]`;
    await ElementHelper.waitForElement('id', `${speed}Button`);
    expect(await $(reqId).isEnabled()).toBe(true);
  }
}
export default new TravelSearchFilterPage();
