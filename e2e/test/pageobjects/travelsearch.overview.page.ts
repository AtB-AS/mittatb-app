import Page from './page';
import ElementHelper from '../utils/element.helper';

class TravelSearchOverviewPage extends Page {
  /**
   * Get the first travel suggestion
   */
  get firstTripResult() {
    const reqId = `//*[@resource-id="tripSearchSearchResult0"]`;
    return $(reqId);
  }

  /**
   * Open the first travel suggestion
   */
  async openFirstSearchResult() {
    await ElementHelper.waitForElement('id', `tripSearchSearchResult0`);
    await this.firstTripResult.click();
    await ElementHelper.waitForElement('id', `tripDetailsContentView`);
  }

  /**
   * Confirm the travel search onboarding - if it exists
   * @param timeoutValue: How long to search for the onboarding confirmation button
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
   * @param tripIndex: index of the journey (default first trip)
   */
  async getNumberOfLegs(tripIndex: number = 0) {
    const tripId = `//*[@resource-id="tripSearchSearchResult${tripIndex}"]`;
    const legId = `//*[@resource-id="tripLeg"]`;
    const moreLegsId = `//*[@resource-id="tripLegMore"]`;
    let noLegs = await $(tripId).$$(legId).length;
    if (await $(tripId).$(moreLegsId).isExisting()) {
      const noLegsExtra = await $(tripId).$(moreLegsId).getText();
      noLegs = noLegs + parseInt(noLegsExtra.split('+')[1]);
    }
    return noLegs;
  }

  /**
   * Returns the start time for travel result at index
   * @param resultIndex: travel search result at index
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
   * @param resultIndex: travel search result at index
   */
  async getEndTime(resultIndex: number) {
    const searchResultId = `//*[@resource-id="tripSearchSearchResult${resultIndex}"]`;
    const endTimeId = `//*[@resource-id="endTime"]`;
    return await $(searchResultId).$(endTimeId).getText();
  }
  /**
   * Returns the given trip duration
   * NB! Must be in minutes
   * @param resultIndex: travel search result at index
   */
  async getTravelTime(resultIndex: number) {
    const searchResultId = `//*[@resource-id="tripSearchSearchResult${resultIndex}"]`;
    const durationId = `//*[@resource-id="resultDuration"]`;
    const duration = await $(searchResultId).$(durationId).getText();
    return parseInt(duration.split(' ')[0]);
  }
}
export default new TravelSearchOverviewPage();
