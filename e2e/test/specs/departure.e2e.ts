import OnboardingPage from '../pageobjects/onboarding.page.ts';
import AppHelper from '../utils/app.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import SearchPage from '../pageobjects/search.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import DepartureSearchPage from '../pageobjects/departure.search.page.ts';
import DepartureOverviewPage from '../pageobjects/departure.overview.page.ts';
import DepartureDetailsPage from '../pageobjects/departure.details.page.ts';

// The same stop place is used if not overrun in test
const stopPlace = 'Prinsens gate';

describe('Departure', () => {
  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('departure');
    await AppHelper.pause(5000, true);
  });
  beforeEach(async () => {
    await NavigationHelper.tapMenu('departures');
    await NavigationHelper.tapMenu('departures');
  });

  /**
   * Search for a stop place directly and show its details
   */
  it('should search for and choose a stop place directly', async () => {
    try {
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await DepartureSearchPage.searchFrom.click();
      await SearchPage.setSearchLocation(stopPlace);

      // Stop place
      await ElementHelper.waitForElement('id', 'departuresContentView');
      await ElementHelper.expectText(stopPlace);
      expect(await DepartureOverviewPage.getDeparture()).toExist();
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_departure_should_search_for_and_choose_a_stop_place_directly',
      );
      throw errMsg;
    }
  });

  /**
   * Check the show more departures and quay tabs
   */
  it('should show departures per quay', async () => {
    try {
      /*
      // If searching for a place and choosing a bus stop
      const placeSearch = 'Emilies ELD';
      const stopPlace = 'Prinsens gate';
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await DepartureSearchPage.searchFrom.click();
      await SearchPage.setSearchLocation(placeSearch);
       */
      await DepartureSearchPage.chooseStopPlace(stopPlace);

      // Stop place
      await ElementHelper.waitForElement('id', 'departuresContentView');
      await ElementHelper.expectText(stopPlace);
      const noDepartures = await DepartureOverviewPage.getNumberOfDepartures(
        '0',
      );

      // Hide / expand quay
      expect(await DepartureOverviewPage.getDeparture()).toExist();
      await DepartureOverviewPage.hideExpandDeps();
      expect(await DepartureOverviewPage.getDeparture()).not.toExist();
      await DepartureOverviewPage.hideExpandDeps();
      expect(await DepartureOverviewPage.getDeparture()).toExist();

      // Show more departures (section link)
      await DepartureOverviewPage.showMoreDepartures();
      let noDeparturesQuay =
        await DepartureOverviewPage.getNumberOfDepartures();
      expect(noDeparturesQuay).toBeGreaterThan(noDepartures);

      // Show stop place
      await DepartureOverviewPage.showAllQuays();

      // Show more departures (quay button)
      await DepartureOverviewPage.showQuay();
      noDeparturesQuay = await DepartureOverviewPage.getNumberOfDepartures();
      expect(noDeparturesQuay).toBeGreaterThan(noDepartures);
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_departure_should_show_more_departures_for_a_single_quay',
      );
      throw errMsg;
    }
  });

  /**
   * Check intermediate stops on departure details
   */
  it('should show intermediate stops', async () => {
    try {
      await DepartureSearchPage.chooseStopPlace(stopPlace);

      // Stop place
      await ElementHelper.waitForElement('id', 'departuresContentView');
      await ElementHelper.expectText(stopPlace);

      // Departure details
      const linePublicCode = await DepartureOverviewPage.getLinePublicCode();
      const lineName = await DepartureOverviewPage.getLineName();
      await DepartureOverviewPage.openDeparture();
      await ElementHelper.waitForElement('id', 'departureDetailsContentView');
      expect(await DepartureDetailsPage.getPublicCode()).toHaveText(
        linePublicCode,
      );
      expect(await DepartureDetailsPage.getLineName()).toHaveText(lineName);

      // Show intermediate stops
      const noPassed = await DepartureDetailsPage.passedLegs.length;
      await DepartureDetailsPage.expandAndHideIntermediateStops();
      const noPassedExpanded = await DepartureDetailsPage.passedLegs.length;
      expect(noPassedExpanded).toBeGreaterThan(noPassed);

      // Show another quay
      const quayName = await DepartureDetailsPage.getQuayName('passed', 0);
      await DepartureDetailsPage.tapQuay('passed', 0);
      await ElementHelper.expectText(quayName);

      await NavigationHelper.back();
      await ElementHelper.waitForElement('id', 'departureDetailsContentView');
      expect(await DepartureDetailsPage.getPublicCode()).toHaveText(
        linePublicCode,
      );
      expect(await DepartureDetailsPage.getLineName()).toHaveText(lineName);
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_departure_should_show_intermediate_stops',
      );
      throw errMsg;
    }
  });
});
