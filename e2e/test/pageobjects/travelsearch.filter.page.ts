import ElementHelper from '../utils/element.helper.ts';
import AppHelper from '../utils/app.helper.ts';
import TravelsearchOverviewPage from './travelsearch.overview.page.js';

class TravelSearchFilterPage {
  /**
   * Return the selected filter button (when transport modes are removed from trip search)
   */
  get selectedFilterButton() {
    const reqId = `//*[@resource-id="selectedFilterButton"]`;
    return $(reqId);
  }

  /**
   * Return the search button within time chooser
   */
  get searchButton() {
    const reqId = `//*[@resource-id="searchButton"]`;
    return $(reqId);
  }

  /**
   * Open the time picker on the travel search results
   */
  async openTravelSearchTimePicker() {
    const reqId = `//*[@resource-id="dashboardDateTimePicker"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('id', `radioButtonNow`);
  }

  /**
   * Choose what to base the search on
   * @param basedOn what to base on (Now | Departure | Arrival)
   */
  async chooseSearchBasedOn(basedOn: 'Now' | 'Departure' | 'Arrival') {
    const reqId = `//*[@resource-id="radioButton${basedOn}"]`;
    await $(reqId).click();
    if (basedOn !== 'Now') {
      await ElementHelper.waitForElement('id', `timePicker`);
    }
  }

  /**
   * Open the native time picker
   */
  async openNativeTimePicker() {
    const reqId = `//*[@resource-id="timePicker"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('id', `android:id/toggle_mode`);
  }

  /**
   * Open the travel search filter
   */
  async openFilter() {
    const reqId = `//*[@resource-id="filterButton"]`;
    await $(reqId).click();
    await ElementHelper.waitForElement('text', `Filter`);
  }

  /**
   * Toggle on of the filters (or the 'all' option)
   * @param type type of filter to toggle (default: allModes)
   */
  async toggleFilter(type: string = 'allModes') {
    const reqId = `//*[@resource-id="${type}Toggle"]`;
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Confirm the chosen filter options
   * @param saveFilter possibility to save the filter (default: false)
   */
  async confirmFilter(saveFilter: boolean = false) {
    const reqId = `//*[@resource-id="confirmButton"]`;
    const saveId = `//*[@resource-id="saveFilterCheckbox"]`;
    // Save filter or not
    if (saveFilter) {
      await AppHelper.scrollDownUntilId('filterView', 'saveFilterCheckbox');
      await $(saveId).click();
    }
    await $(reqId).click();
    await AppHelper.pause();
  }

  /**
   * Check that filters are changed and a "filter-box" is shown
   * @param expectedText text that should be contained in the "filter-box"
   */
  async shouldShowSelectedFilter(expectedText: string) {
    const reqId = `//*[@resource-id="selectedFilterButton"]`;
    const textId = `//*[@resource-id="buttonText"]`;
    await ElementHelper.waitForElement('id', `selectedFilterButton`);
    await expect(await $(reqId).$(textId).getText()).toContain(expectedText);
  }

  /**
   * Remove the selected filter, i.e. the "filter-box"
   */
  async removeSelectedFilter() {
    const reqId = `//*[@resource-id="selectedFilterButton"]`;
    await $(reqId).click();
  }

  /**
   * Remove the selected filter - if it exists, i.e. the "filter-box"
   */
  async removeSelectedFilterIfExists() {
    const reqId = `//*[@resource-id="selectedFilterButton"]`;
    const exists: boolean = await $(reqId).isExisting();
    if (exists) {
      await $(reqId).click();
      await TravelsearchOverviewPage.waitForTravelSearchResults();
    }
  }
}
export default new TravelSearchFilterPage();
