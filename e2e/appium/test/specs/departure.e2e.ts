import OnboardingPage from '../pageobjects/onboarding.page';
import AppHelper from '../utils/app.helper';
import ElementHelper from '../utils/element.helper';
import SearchPage from '../pageobjects/search.page';
import NavigationHelper from '../utils/navigation.helper';
import DepartureSearchPage from '../pageobjects/departure.search.page';
import DepartureOverviewPage from '../pageobjects/departure.overview.page';
import DepartureDetailsPage from '../pageobjects/departure.details.page';

describe('Departure', () => {
  before(async () => {
    await AppHelper.launchApp();
    await OnboardingPage.skipOnboarding();
    await NavigationHelper.tapMenu('departures');
    await DepartureSearchPage.confirmOnboarding();
  });
  beforeEach(async () => {
    await NavigationHelper.tapMenu('departures');
    await NavigationHelper.tapMenu('departures');
  });

  /**
   * Search for a place and choose a stop place
   */
  it('should search for a stop place nearby', async () => {
    const placeSearch = 'Emilies ELD';
    const stopPlace = 'Prinsens gate';

    try {
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await DepartureSearchPage.searchFrom.click();
      await SearchPage.setSearchLocation(placeSearch);

      // Nearby stop places
      await DepartureSearchPage.chooseStopPlace(stopPlace);

      // Stop place
      await ElementHelper.expectText(stopPlace);
      const linePublicCode = await DepartureOverviewPage.getLinePublicCode();
      const lineName = await DepartureOverviewPage.getLineName();
      //Note: quaySelectionButton doesn't give the button text

      // Hide / expand quay
      expect(await DepartureOverviewPage.getDeparture()).toExist();
      await DepartureOverviewPage.hideExpandDeps();
      await AppHelper.screenshot('hide');
      expect(await DepartureOverviewPage.getDeparture()).not.toExist();
      await DepartureOverviewPage.hideExpandDeps();
      expect(await DepartureOverviewPage.getDeparture()).toExist();

      // Departure details
      const departure = await DepartureOverviewPage.getDeparture();
      await departure.click();
      await ElementHelper.waitForElement('id', 'departureDetailsContentView');
      await ElementHelper.expectText(`${linePublicCode} ${lineName}`);

      // Back
      await NavigationHelper.back();
      await ElementHelper.expectText(stopPlace);
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_departure_should_search_for_a_stop_place',
      );
      throw errMsg;
    }
  });

  /**
   * Search for a stop place directly and show its details
   */
  it('should search for and choose a stop place directly', async () => {
    const stopPlace = 'Kongens gate';

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
  it('should show more departures for a single quay', async () => {
    const stopPlace = 'Prinsens gate';

    try {
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await DepartureSearchPage.searchFrom.click();
      await SearchPage.setSearchLocation(stopPlace);

      // Stop place
      await ElementHelper.waitForElement('id', 'departuresContentView');
      await ElementHelper.expectText(stopPlace);
      const noDepartures = await DepartureOverviewPage.getNumberOfDepartures(
        '0',
      );

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
    //NB! If same stop place is chosen after tapping 'departuresTab', you don't go directly
    const stopPlace = 'Kongens gate';

    try {
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await DepartureSearchPage.searchFrom.click();
      await SearchPage.setSearchLocation(stopPlace);

      // Stop place
      await ElementHelper.waitForElement('id', 'departuresContentView');
      await ElementHelper.expectText(stopPlace);

      // Departure details
      const linePublicCode = await DepartureOverviewPage.getLinePublicCode();
      const lineName = await DepartureOverviewPage.getLineName();
      const departure = await DepartureOverviewPage.getDeparture();
      await departure.click();
      await ElementHelper.waitForElement('id', 'departureDetailsContentView');
      await ElementHelper.expectText(`${linePublicCode} ${lineName}`);

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
      await ElementHelper.expectText(`${linePublicCode} ${lineName}`);
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_departure_should_show_intermediate_stops',
      );
      throw errMsg;
    }
  });
});
