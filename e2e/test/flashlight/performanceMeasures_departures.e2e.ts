import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import SearchPage from '../pageobjects/search.page.ts';
import DepartureSearchPage from '../pageobjects/departure.search.page.js';
import DepartureOverviewPage from '../pageobjects/departure.overview.page.js';

/**
 * Travel search interactions. Used together with '$ flashlight measure/test' to get performance metrics
 */
describe('Travel search performance with flashlight', () => {
  // Waiting time between actions in ms
  const waitingTime = 5000;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('flashlight_travelsearch');
    await AppHelper.pause(2000);
  });

  /**
   * Departures: search for a stop place directly and show its departures
   */
  it('should show departures', async () => {
    const stopPlace = 'Prinsens gate';

    try {
      await NavigationHelper.tapMenu('departures');

      await ElementHelper.waitForElement('id', 'searchFromButton');
      await DepartureSearchPage.searchFrom.click();
      await SearchPage.setSearchLocation(stopPlace);

      // Stop place
      await ElementHelper.waitForElement('id', 'departuresContentView');
      await ElementHelper.expectText(stopPlace);
      expect(await DepartureOverviewPage.getDeparture()).toExist();
      await AppHelper.pause(waitingTime);

      // Show more departures
      await DepartureOverviewPage.showMoreDepartures();
      await AppHelper.pause(waitingTime);
      for (let i = 0; i < 5; i++) {
        await AppHelper.scrollDown('departuresContentView');
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_should_show_departures');
      throw errMsg;
    }
  });
});
