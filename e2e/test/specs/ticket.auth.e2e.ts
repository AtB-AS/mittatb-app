import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import TicketBuyPage from '../pageobjects/ticket.buy.page.ts';
import PurchaseOverviewPage from '../pageobjects/purchase.overview.page.ts';
import PurchaseSummaryPage from '../pageobjects/purchase.summary.page.ts';
import Config from '../conf/config.js';
import MyProfilePage from '../pageobjects/profile.page.js';
import AuthenticationPage from '../pageobjects/authentication.page.js';
import {formatPhoneNumber} from '../utils/utils.js';

describe('Ticket Authorized', () => {
  const phoneNumber = Config.phoneNumber();
  let authorized = false;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
  });

  it('should login', async () => {
    try {
      /*
      // Log in through my profile
      await NavigationHelper.tapMenu('profile');
      await NavigationHelper.tapMenu('profile');
      await ElementHelper.waitForElement('text', 'Profile');
      await MyProfilePage.login.click();
      await AuthenticationPage.loginWithPhone(phoneNumber)
      await ElementHelper.waitForElement('text', 'Travel search');
       */

      // Log in through the onboarding
      await AuthenticationPage.loginWithPhone(phoneNumber);
      await OnboardingPage.denyLocationInOnboarding();
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
      await AppHelper.screenshot('error_ticket_login');
      throw errMsg;
    }
  });

  // Choose to buy a ticket on behalf of others, and check the information along the purchase flow
  it('should be able to buy on behalf of others', async () => {
    const onBehalfOfPhoneNumber: number = 91111111;
    const onBehalfOfPhoneNumberFormatted: string = '+47 91 11 11 11';

    try {
      if (authorized) {
        await NavigationHelper.tapMenu('tickets');
        await TicketBuyPage.chooseFareProduct('single');
        await ElementHelper.waitForElement(
          'text',
          'Single ticket, bus and tram',
        );
        await AppHelper.removeGlobalMessages();

        expect(await PurchaseOverviewPage.getTraveller()).toContain('1 Adult');

        // Set on-behalf-of
        await PurchaseOverviewPage.selectTraveller();
        await PurchaseOverviewPage.decreaseTravellerCount('adult');
        await PurchaseOverviewPage.increaseTravellerCount('child');
        await PurchaseOverviewPage.confirmTravellers();
        expect(await PurchaseOverviewPage.onBehalfOfToggle).not.toBeChecked();
        await PurchaseOverviewPage.onBehalfOfToggle.click();

        // Ensure an offer
        const hasOffer: boolean = await PurchaseOverviewPage.hasOffer();
        if (hasOffer) {
          const totalPrice: number = await PurchaseOverviewPage.getTotalPrice();
          await PurchaseOverviewPage.goToPayment.click();

          // On-behalf-of
          await ElementHelper.waitForElement('text', 'Buy for others');
          await PurchaseOverviewPage.setPhoneNumber(onBehalfOfPhoneNumber);
          await PurchaseOverviewPage.goToPaymentOnBehalfOf.click();

          // Ticket summary
          await ElementHelper.waitForElement('text', 'Ticket summary', 15000);
          expect(
            await PurchaseSummaryPage.summaryOnBehalfOfText.getText(),
          ).toContain(`Sending to ${onBehalfOfPhoneNumberFormatted}`);
          expect(
            await PurchaseSummaryPage.userProfileCountAndName.getText(),
          ).toContain('1 Child');
          expect(await PurchaseSummaryPage.getTotalPrice()).toBe(totalPrice);
          expect(await PurchaseSummaryPage.choosePayment.isEnabled()).toBe(
            true,
          );

          await NavigationHelper.back();
          await AppHelper.pause();
          await NavigationHelper.back();
          await AppHelper.pause();
          await NavigationHelper.back();
        }
        // No offer
        else {
          expect(await PurchaseOverviewPage.goToPayment).toBeDisabled();
          await NavigationHelper.back();
        }
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_ticket_buy_on_behalf_of');
      throw errMsg;
    }
  });
});
