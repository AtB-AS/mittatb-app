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
import TicketBuyPage from '../pageobjects/ticket.buy.page.js';
import PurchaseOverviewPage from '../pageobjects/purchase.overview.page.js';
import PurchaseSummaryPage from '../pageobjects/purchase.summary.page.js';
import PurchasePaymentPage from '../pageobjects/purchase.payment.page.js';
import OnboardingPage from '../pageobjects/onboarding.page.js';

describe('Smoke tests', () => {
  const phoneNumber = Config.phoneNumber();
  let authorized = false;

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

      // Details
      await TravelsearchOverviewPage.openSearchResult();
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
    } catch (errMsg) {
      await AppHelper.screenshot('error_smoke_departures');
      throw errMsg;
    }
  });

  // Walk through the purchase flow for a single ticket - without the actual purchase
  it('should buy a ticket', async () => {
    try {
      await NavigationHelper.tapMenu('tickets');
      await NavigationHelper.tapTicketTab('purchase');

      await TicketBuyPage.chooseFareProduct('single');
      await ElementHelper.waitForElement('text', 'Single ticket, bus and tram');
      await AppHelper.removeGlobalMessages();
      await AppHelper.scrollDownUntilId(
        'purchaseOverviewScrollView',
        'goToPaymentButton',
      );

      const hasOffer: boolean = await PurchaseOverviewPage.hasOffer();
      if (hasOffer) {
        await PurchaseOverviewPage.goToPayment.click();

        // Ticket summary
        await ElementHelper.waitForElement('text', 'Ticket summary');
        expect(await PurchaseSummaryPage.summaryText.getText()).toContain(
          'Valid in zone A',
        );
        expect(
          await PurchaseSummaryPage.travellerCountAndName.getText(),
        ).toContain('1 Adult');

        // Confirm - or choose payment and confirm
        if (authorized) {
          if (!(await PurchaseSummaryPage.confirmPayment.isExisting())) {
            await PurchaseSummaryPage.choosePayment.click();
            await PurchasePaymentPage.chooseRecurringPaymentCard();
            await PurchasePaymentPage.confirmPayment.click();
          }
          await ElementHelper.waitForElement('id', 'confirmPaymentButton');
          expect(
            await PurchaseSummaryPage.recurringPaymentCard.isExisting(),
          ).toBe(true);

          // Do NOT purchase
          //await PurchaseSummaryPage.confirmPayment.click();
        }
        await AppHelper.pause();
        await NavigationHelper.back();
        await AppHelper.pause();
        await NavigationHelper.back();
      } else {
        console.log(`[WARN] Ticket not purchased due to no offer received`);
        expect(await PurchaseOverviewPage.goToPayment.isEnabled()).toBe(false);
        await NavigationHelper.back();
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_smoke_ticket');
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
