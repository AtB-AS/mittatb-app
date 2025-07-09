import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import FrontPagePage from '../pageobjects/frontpage.page.ts';
import SearchPage from '../pageobjects/search.page.ts';
import TravelsearchOverviewPage from '../pageobjects/travelsearch.overview.page.ts';
import DepartureSearchPage from '../pageobjects/departure.search.page.ts';
import DepartureOverviewPage from '../pageobjects/departure.overview.page.ts';
import TicketPage from '../pageobjects/ticket.page.ts';

/**
 * Runs through some simple use cases in the app. Used together with '$ flashlight measure' to get performance metrics
 * - A simple travel search
 * - Open the map
 * - Find departures
 * - Open the ticket page
 * - Open profile
 */
describe('Flashlight performance measure', () => {
  // Waiting time between actions in ms
  const waitingTime = 5000;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('flashlight');
    await AppHelper.pause(5000);
  });
  // Put the app in the background between each test - easier to distinguish the separate tests in graphs
  // (i.e. the JS-thread CPU is 0)
  beforeEach(async () => {
    await driver.background(10);
    await AppHelper.pause(2000);
  });

  /**
   * Travel search: do a simple travel search and show a travel
   */
  it('should do a travel search', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    try {
      await NavigationHelper.tapMenu('assistant');
      await NavigationHelper.tapMenu('assistant');

      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);

      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);
      await AppHelper.pause(waitingTime);
      await TravelsearchOverviewPage.waitForTravelSearchResults();

      // ** Details **
      await TravelsearchOverviewPage.openFirstSearchResult();
      await AppHelper.pause(waitingTime);
    } catch (errMsg) {
      await AppHelper.screenshot('error_should_do_a_travel_search');
      throw errMsg;
    }
  });

  /**
   * Map: open the map
   */
  it('should show the map', async () => {
    try {
      await NavigationHelper.tapMenu('map');
      await NavigationHelper.tapMenu('map');
      await AppHelper.pause(waitingTime);
    } catch (errMsg) {
      await AppHelper.screenshot('error_should_show_the_map');
      throw errMsg;
    }
  });

  /**
   * Departures: search for a stop place directly and show its departures
   */
  it('should show departures', async () => {
    const stopPlace = 'Prinsens gate';

    try {
      await NavigationHelper.tapMenu('departures');
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
    } catch (errMsg) {
      await AppHelper.screenshot('error_should_show_departures');
      throw errMsg;
    }
  });

  /**
   * Tickets: open tickets and choose a product
   */
  it('should show tickets', async () => {
    try {
      await NavigationHelper.tapMenu('tickets');
      await NavigationHelper.tapMenu('tickets');

      await ElementHelper.waitForElement('id', 'purchaseTab');
      await AppHelper.pause(waitingTime);

      // Choose a fare product
      await TicketPage.chooseFareProduct('single');
      await ElementHelper.waitForElement('text', 'Single ticket, bus and tram');
      await AppHelper.pause(waitingTime);

      await NavigationHelper.back();
    } catch (errMsg) {
      await AppHelper.screenshot('error_should_show_tickets');
      throw errMsg;
    }
  });

  /**
   * Profile: open profile
   */
  it('should show profile', async () => {
    try {
      await NavigationHelper.tapMenu('profile');
      await NavigationHelper.tapMenu('profile');

      await ElementHelper.waitForElement('id', 'profileHomeScrollView');
      await AppHelper.pause(waitingTime);
    } catch (errMsg) {
      await AppHelper.screenshot('error_should_show_my_profile');
      throw errMsg;
    }
  });
});
