import AppHelper from '../utils/app.helper.ts';
import Config from '../conf/config.js';
import NavigationHelper from '../utils/navigation.helper.js';
import ElementHelper from '../utils/element.helper.js';
import AuthenticationPage from '../pageobjects/authentication.page.js';
import ProfilePage from '../pageobjects/profile.page.js';
import MyProfilePage from '../pageobjects/profile.page.js';
import {formatPhoneNumber} from '../utils/utils.js';
import FrontPagePage from '../pageobjects/frontpage.page.js';
import SearchPage from '../pageobjects/search.page.js';
import TravelsearchOverviewPage from '../pageobjects/travelsearch.overview.page.js';
import DepartureSearchPage from '../pageobjects/departure.search.page.js';
import DepartureOverviewPage from '../pageobjects/departure.overview.page.js';
import OnboardingPage from '../pageobjects/onboarding.page.js';
import TicketActivePage from '../pageobjects/ticket.active.page.js';
import MapPage from '../pageobjects/map.page.js';

describe('Performance tests', () => {
  const phoneNumber = Config.phoneNumber();
  let authorized = false;
  // Waiting time between actions in ms
  const waitingTime = 5000;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    await OnboardingPage.skipOnboarding('smoke');
    await AppHelper.pause(2000, true);
  });

  it('should login', async () => {
    try {
      await NavigationHelper.tapMenu('profile');
      await ElementHelper.waitForElement('text', 'Profile');
      await ProfilePage.login.click();
      await AuthenticationPage.loginWithPhone(phoneNumber);
      await OnboardingPage.waitOnTokenOnboarding(false);
      await ElementHelper.waitForElement('text', 'Travel');
      await AppHelper.pause(2000);

      // Verify
      await NavigationHelper.tapMenu('profile');
      await ElementHelper.waitForElement('text', 'Profile');
      expect(await MyProfilePage.loggedInWithInfo).toContain(
        formatPhoneNumber(phoneNumber),
      );
      authorized = true;
    } catch (errMsg) {
      await AppHelper.screenshot('error_smoke_login');
      throw errMsg;
    }
  });

  it('should do a travel search', async () => {
    const departure = 'Prinsens gate';
    const arrival = 'Melhus skysstasjon';

    try {
      await NavigationHelper.tapMenu('assistant');
      await ElementHelper.waitForElement('id', 'searchFromButton');
      await FrontPagePage.searchFrom.click();
      await SearchPage.setSearchLocation(departure);

      await ElementHelper.waitForElement('id', 'searchToButton');
      await FrontPagePage.searchTo.click();
      await SearchPage.setSearchLocation(arrival);

      await TravelsearchOverviewPage.waitForTravelSearchResults();
      await AppHelper.pause(waitingTime);

      // Details
      await TravelsearchOverviewPage.openSearchResult();
      await AppHelper.pause(waitingTime);
      await NavigationHelper.back();
    } catch (errMsg) {
      await AppHelper.screenshot('error_smoke_travel_search');
      throw errMsg;
    }
  });

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

      // Details
      await DepartureOverviewPage.openDeparture();
      await NavigationHelper.back();

      // Show more departures
      await DepartureOverviewPage.showMoreDepartures();
      await AppHelper.pause(waitingTime);
      for (let i = 0; i < 5; i++) {
        await AppHelper.scrollDown('departuresContentView');
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_smoke_departures');
      throw errMsg;
    }
  });

  // Tickets: open active tickets including expired tickets
  it('should show tickets', async () => {
    if (authorized) {
      try {
        await NavigationHelper.tapMenu('tickets');
        await NavigationHelper.tapTicketTab('activeTickets');
        await AppHelper.pause(waitingTime);

        // Open expired tickets
        await TicketActivePage.openExpiredTickets();
        for (let i = 0; i < 3; i++) {
          await AppHelper.scrollDown('ticketHistoryScrollView');
        }
        await AppHelper.pause(waitingTime);

        await NavigationHelper.back();
      } catch (errMsg) {
        await AppHelper.screenshot('error_should_show_tickets');
        throw errMsg;
      }
    }
  });

  it('should interact with the map', async () => {
    try {
      const mapId: string = 'mapView';
      await NavigationHelper.tapMenu('map');
      await NavigationHelper.tapMenu('map');
      await AppHelper.pause(waitingTime);
      await ElementHelper.waitForElement('id', mapId);

      // Zoom
      await MapPage.pinchZoomOut('large');
      await MapPage.pinchZoomIn('large');
      await MapPage.pinchZoomOut('large');
      await MapPage.pinchZoomIn('small');

      // Move around
      await MapPage.drag('right', 'short');
      await MapPage.drag('up', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.drag('right', 'long');
      await MapPage.drag('right', 'short');
      await MapPage.drag('left', 'short');
      await MapPage.drag('left', 'long');
      await MapPage.drag('up', 'short');
      await MapPage.drag('left', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.drag('right', 'long');
      await MapPage.drag('down', 'long');

      // Toggle off
      await MapPage.toggle('car');
      await MapPage.toggle('bicycle');
      await MapPage.toggle('scooter');
      await MapPage.drag('left', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.drag('right', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomIn('small');

      // Toggle on
      await MapPage.toggle('bicycle');
      await MapPage.toggle('scooter');
      await MapPage.pinchZoomIn('large');
      await MapPage.drag('right', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.drag('left', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.drag('up', 'long');
      await MapPage.drag('right', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.drag('down', 'long');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomOut('small');
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomIn('small');
      await MapPage.pinchZoomIn('small');
    } catch (errMsg) {
      await AppHelper.screenshot('error_map_interact');
      throw errMsg;
    }
  });

  it('should log out', async () => {
    if (authorized) {
      try {
        await NavigationHelper.tapMenu('profile');
        await ElementHelper.waitForElement('text', 'Profile');
        await ProfilePage.logout();
      } catch (errMsg) {
        await AppHelper.screenshot('error_smoke_logout');
        throw errMsg;
      }
    }
  });
});
