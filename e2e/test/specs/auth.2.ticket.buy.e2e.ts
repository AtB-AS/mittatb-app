import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import TicketBuyPage from '../pageobjects/ticket.buy.page.js';
import PurchaseOverviewPage from '../pageobjects/purchase.overview.page.js';
import PurchaseSummaryPage from '../pageobjects/purchase.summary.page.js';
import PurchasePaymentPage from '../pageobjects/purchase.payment.page.js';
import MyProfilePage from '../pageobjects/profile.page.js';
import AuthenticationPage from '../pageobjects/authentication.page.js';
import {formatPhoneNumber} from '../utils/utils.js';
import Config from '../conf/config.js';

describe('Auth Buy Ticket', () => {
  const phoneNumber = Config.phoneNumber();
  let authorized = false;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
  });

  it('should login', async () => {
    try {
      // Log in through the onboarding
      await AuthenticationPage.loginWithPhone(phoneNumber);
      await OnboardingPage.denyLocationInOnboarding();
      await OnboardingPage.waitOnTokenOnboarding(false)
      await ElementHelper.waitForElement('text', 'Travel search');
      await AppHelper.pause(2000);

      // Verify
      await NavigationHelper.tapMenu('profile');
      await NavigationHelper.tapMenu('profile');
      await ElementHelper.waitForElement('text', 'Profile');
      expect(await MyProfilePage.loggedInWithInfo).toContain(
        formatPhoneNumber(phoneNumber),
      );
      authorized = true;
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_login');
      throw errMsg;
    }
  });

  /*
    Purchase a ticket. Checking afterward is in 'auth.2.ticket.e2e.ts' since the change to in-app browser
    messes up the sessions.
   */
  it('should buy a ticket', async () => {
    try {
      if (authorized) {
        await NavigationHelper.tapMenu('tickets');
        await NavigationHelper.tapTicketTab('purchase');

        await TicketBuyPage.chooseFareProduct('single');
        await ElementHelper.waitForElement(
          'text',
          'Single ticket, bus and tram',
        );
        await AppHelper.removeGlobalMessages();
        await AppHelper.scrollDownUntilId('purchaseOverviewScrollView', 'goToPaymentButton')

        const hasOffer: boolean = await PurchaseOverviewPage.hasOffer();
        if (hasOffer) {
          await PurchaseOverviewPage.goToPayment.click();

          // Ticket summary
          await ElementHelper.waitForElement('text', 'Ticket summary');
          expect(await PurchaseSummaryPage.summaryText.getText()).toContain(
            'Valid in zone A',
          );
          expect(
            await PurchaseSummaryPage.userProfileCountAndName.getText(),
          ).toContain('1 Adult');

          // Confirm - or choose payment and confirm
          if (!(await PurchaseSummaryPage.confirmPayment.isExisting())) {
            await PurchaseSummaryPage.choosePayment.click();
            await PurchasePaymentPage.chooseRecurringPaymentCard();
            await PurchasePaymentPage.confirmPayment.click();
          }
          await ElementHelper.waitForElement('id', 'confirmPaymentButton');
          expect(
            await PurchaseSummaryPage.recurringPaymentCard.isExisting(),
          ).toBe(true);
          await PurchaseSummaryPage.confirmPayment.click();

          await AppHelper.pause(5000);
        } else {
          console.log(`[WARN] Ticket not purchased due to no offer received`);
        }
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_buy');
      throw errMsg;
    }
  });
});
