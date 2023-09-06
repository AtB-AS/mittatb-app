import AppHelper from "../utils/app.helper";
import OnboardingPage from "../pageobjects/onboarding.page";
import NavigationHelper from "../utils/navigation.helper";
import ElementHelper from "../utils/element.helper";
import FrontPagePage from "../pageobjects/frontpage.page";
import SearchPage from "../pageobjects/search.page";
import TravelsearchOverviewPage from "../pageobjects/travelsearch.overview.page";
import DepartureSearchPage from "../pageobjects/departure.search.page";
import DepartureOverviewPage from "../pageobjects/departure.overview.page";
import TicketPage from "../pageobjects/ticket.page";
import MapPage from "../pageobjects/map.page";


/**
 * Runs through some simple use cases in the app. Used together with '$ flashlight measure' to get performance metrics
 * - A simple travel search
 * - Open the map
 * - Find departures
 * - Open the ticket page
 * - Open my profile
 * - Put the app in background and activate it again
 */
describe('Flashlight performance measure', () => {

  // Waiting time between actions in ms
  const waitingTime = 10000

  before(async () => {
    await AppHelper.launchApp();
    await AppHelper.pause(10000, true);
    await OnboardingPage.skipOnboarding('flashlight');
    await AppHelper.pause(waitingTime)
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

      // Onboarding (Check just in case)
      await TravelsearchOverviewPage.confirmOnboarding();
      await AppHelper.pause(waitingTime)

      // ** Details **
      await TravelsearchOverviewPage.openFirstSearchResult();
      await AppHelper.pause(waitingTime)
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_should_do_a_travel_search',
      );
      throw errMsg;
    }
  })

  /**
   * Map: open the map
   */
  it('should show the map', async () => {
    try {
      await NavigationHelper.tapMenu('map');
      await NavigationHelper.tapMenu('map');

      // Onboarding (Check just in case)
      await MapPage.confirmOnboarding();
      await AppHelper.pause(waitingTime)
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_should_show_the_map',
      );
      throw errMsg;
    }
  })

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
      await AppHelper.pause(waitingTime)

      // Show more departures
      await DepartureOverviewPage.showMoreDepartures();
      await AppHelper.pause(waitingTime)
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_should_show_departures',
      );
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
      await AppHelper.pause(waitingTime)

      // Choose a fare product
      await TicketPage.chooseFareProduct('single')
      await ElementHelper.waitForElement('text', 'Single ticket, bus and tram');
      await AppHelper.pause(waitingTime)

      await NavigationHelper.back();
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_should_show_tickets',
      );
      throw errMsg;
    }
  });

  /**
   * My profile: open my profile
   */
  it('should show my profile', async () => {
    try {
      await NavigationHelper.tapMenu('profile');
      await NavigationHelper.tapMenu('profile');

      await ElementHelper.waitForElement('id', 'profileHomeScrollView');
      await AppHelper.pause(waitingTime)
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_should_show_my_profile',
      );
      throw errMsg;
    }
  });

  /**
   * Background: put the app in background and awake it
   */
  it.only('should awake from background', async () => {
    try {
      await NavigationHelper.tapMenu('assistant');
      await NavigationHelper.tapMenu('assistant');
      await ElementHelper.waitForElement('id', 'searchFromButton');

      await AppHelper.pause(waitingTime)
      await driver.background(10)
      await AppHelper.pause(2000)
      await NavigationHelper.tapMenu('departures');
      await AppHelper.pause(waitingTime)
    } catch (errMsg) {
      await AppHelper.screenshot(
        'error_should_awake_from_background',
      );
      throw errMsg;
    }
  })

})