import ElementHelper from '../utils/element.helper.ts';
import AppHelper from '../utils/app.helper.js';

class TravelSearchOverviewPage {
  /**
   * Get the travel suggestion - for bike
   */
  get bikeResult() {
    const reqId = `//*[@resource-id="bicycleResult"]`;
    return $(reqId);
  }

  /**
   * Get the travel suggestion text - for bike
   */
  get bikeResultText() {
    const reqId = `//*[@resource-id="bicycleResult"]`;
    const textId = `//*[@resource-id="buttonText"]`;
    //return await $(reqId).$(textId).getText();
    return $(reqId).$(textId).getText();
  }

  /**
   * Get the travel suggestion - for walking
   */
  get walkResult() {
    const reqId = `//*[@resource-id="footResult"]`;
    return $(reqId);
  }

  /**
   * Get the travel suggestion text - for walking
   */
  get walkResultText() {
    const reqId = `//*[@resource-id="footResult"]`;
    const textId = `//*[@resource-id="buttonText"]`;
    return $(reqId).$(textId).getText();
  }

  /**
   * Get a travel suggestion
   * @param index suggestion to return (default: 0, i.e. the first)
   */
  async tripResult(index: number = 0) {
    const reqId = `//*[@resource-id="tripSearchSearchResult${index}"]`;
    return $(reqId);
  }

  /**
   * Open a travel suggestion
   * @param index which suggestion to open (default: 0, i.e. the first)
   */
  async openSearchResult(index: number = 0) {
    await ElementHelper.waitForElement('id', `tripSearchSearchResult${index}`);
    const tripResult = await this.tripResult(index)
    await tripResult.click();
    await ElementHelper.waitForElement('id', `tripDetailsContentView`);
    await ElementHelper.waitForElement('id', `legContainer0`);
  }

  /**
   * Wait until the results are loaded
   */
  async waitForTravelSearchResults() {
    await ElementHelper.waitForElement('id', `tripSearchContentView`, 20000);
    await ElementHelper.waitForElement('id', `tripSearchSearchResult0`, 20000);
  }

  /**
   * Check if there are any travel search results
   */
  async hasTravelSearchResults() {
    await ElementHelper.waitForElement('id', `tripSearchContentView`, 20000);
    return ElementHelper.isElementExisting('tripSearchSearchResult0', 20);
  }

  /**
   * Confirm the travel search onboarding - if it exists
   * @param timeoutValue How long to search for the onboarding confirmation button
   */
  async confirmOnboarding(timeoutValue: number = 10) {
    const id = `//*[@resource-id="filterOnboardingConfirmButton"]`;
    // Check for n sec
    const exists = await ElementHelper.isElementExisting(
      'filterOnboardingConfirmButton',
      timeoutValue,
    );
    if (exists) {
      await $(id).click();
    }
  }

  /**
   * Return the number of legs for a journey
   * @param tripIndex index of the journey (default first trip)
   */
  async getNumberOfLegs(tripIndex: number = 0) {
    const tripId = `//*[@resource-id="tripSearchSearchResult${tripIndex}"]`;
    const legId = `//*[@resource-id="tripLeg"]`;
    const moreLegsId = `//*[@resource-id="tripLegMore"]`;
    await ElementHelper.waitForElement(
      'id',
      `tripSearchSearchResult${tripIndex}`,
    );
    await ElementHelper.waitForElement('id', `tripLeg`, 20000);
    let noLegs = await $(tripId).$$(legId).length;
    if (await $(tripId).$(moreLegsId).isExisting()) {
      const noLegsExtra = await $(tripId).$(moreLegsId).getText();
      noLegs = noLegs + parseInt(noLegsExtra.split('+')[1]);
    }
    return noLegs;
  }

  /**
   * Returns the start time for travel result at index
   * @param resultIndex travel search result at index
   */
  async getStartTime(resultIndex: number) {
    const searchResultId = `//*[@resource-id="tripSearchSearchResult${resultIndex}"]`;
    const schTimeId = `//*[@resource-id="schTime0"]`;
    const aimTimeId = `//*[@resource-id="aimTime0"]`;
    // Either scheduled or aimed time
    if (await $(searchResultId).$(aimTimeId).isExisting()) {
      return await $(searchResultId).$(aimTimeId).getText();
    }
    return await $(searchResultId).$(schTimeId).getText();
  }

  /**
   * Returns the end time for travel result at index
   * @param resultIndex travel search result at index
   */
  async getEndTime(resultIndex: number) {
    const searchResultId = `//*[@resource-id="tripSearchSearchResult${resultIndex}"]`;
    const endTimeId = `//*[@resource-id="endTime"]`;
    return await $(searchResultId).$(endTimeId).getText();
  }

  /**
   * Returns the given trip duration
   * NB! Must be in minutes
   * @param resultIndex travel search result at index
   */
  async getTravelTime(resultIndex: number) {
    const searchResultId = `//*[@resource-id="tripSearchSearchResult${resultIndex}"]`;
    const durationId = `//*[@resource-id="resultDuration"]`;
    const duration = await $(searchResultId).$(durationId).getText();
    return duration.split(' ')[0];
  }

  /**
   * Get number of transport modes from X first travel search results
   * NOTE! Only bus and rail modes
   * @param numberOfResults the number of results to check
   */
  async getNumberOfTransportModesInSearch(numberOfResults: number = 10) {
    let noBusLegs = 0;
    let noRailLegs = 0;
    // Loop through the search results and count the different modes
    for (let i = 0; i < numberOfResults; i++) {
      const tripId = `//*[@resource-id="tripSearchSearchResult${i}"]`;
      const busModeId = `//*[@resource-id="busLeg"]`;
      const railModeId = `//*[@resource-id="railLeg"]`;

      // Scroll down if trip result is not displayed
      // Handle if the visible trip results are less than the default
      let resultExists = await ElementHelper.isElementExisting(
        `tripSearchSearchResult${i}`,
        1,
      );
      if (!resultExists) {
        await AppHelper.scrollDown('tripSearchContentView');
        resultExists = await ElementHelper.isElementExisting(
          `tripSearchSearchResult${i}`,
          1,
        );
        if (!resultExists) {
          break;
        }
      }

      noBusLegs += await $(tripId).$$(busModeId).length;
      noRailLegs += await $(tripId).$$(railModeId).length;
    }

    // Find and return number of different transport modes
    const busLegsExists: number = noBusLegs > 0 ? 1 : 0;
    const railLegsExists: number = noRailLegs > 0 ? 1 : 0;
    return busLegsExists + railLegsExists;
  }
}
export default new TravelSearchOverviewPage();
