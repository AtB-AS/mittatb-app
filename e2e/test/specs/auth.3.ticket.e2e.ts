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
import TokenPage from "../pageobjects/token.page.js";
import TicketActivePage from "../pageobjects/ticket.active.page.js";
import {performancetotal} from "wdio-performancetotal-service";
import TicketDetailsPage from "../pageobjects/ticket.details.page.js";
import ProfilePage from "../pageobjects/profile.page.js";
import FrontPagePage from "../pageobjects/frontpage.page.js";
import TicketFrontpagePage from "../pageobjects/ticket.frontpage.page.js";

describe('Auth Ticket', () => {
  const phoneNumber = Config.phoneNumber();
  let authorized = false;
  let hasMobileTokenOnThisDevice = false;
  let hasMobileTokenOnOtherDevice = false;

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

  // Check type of mobile token for use in the ticket details
  it('should check mobile token type', async () => {
    try {
      await NavigationHelper.tapMenu('profile');
      await ProfilePage.open('settings');
      if (authorized) {
        await ProfilePage.open('travelToken');

        // Check type of mobile token
        hasMobileTokenOnThisDevice = await TokenPage.deviceNameExists('this')
        hasMobileTokenOnOtherDevice = await TokenPage.deviceNameExists('other')
      }
      await NavigationHelper.tapMenu('profile');
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_token_check');
      throw errMsg;
    }
  })

  // Choose to buy a ticket on behalf of others, and check the information along the purchase flow
  xit('should be able to buy on behalf of others', async () => {
    const onBehalfOfPhoneNumber: number = 91111111;
    const onBehalfOfPhoneNumberFormatted: string = '+47 91 11 11 11';

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

        expect(await PurchaseOverviewPage.getTraveller()).toContain('1 Adult');

        // Set on-behalf-of
        await PurchaseOverviewPage.selectTraveller();
        await PurchaseOverviewPage.decreaseTravellerCount('adult');
        await PurchaseOverviewPage.increaseTravellerCount('child');
        await PurchaseOverviewPage.confirmTravellers();
        expect(await PurchaseOverviewPage.onBehalfOfToggle).not.toBeChecked();
        await PurchaseOverviewPage.onBehalfOfToggle.click();

        // Ensure an offer
        await AppHelper.scrollDownUntilId('purchaseOverviewScrollView', 'goToPaymentButton')
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
      await AppHelper.screenshot('error_auth_ticket_on_behalf_of');
      throw errMsg;
    }
  });

  /*
    - Check ticket on front page
    - Check some ticket details if the ticket is valid
    - Check the barcode type depending on the token
   */
  it('should have a valid ticket on frontpage', async () => {
    try {
      if (authorized) {
        await NavigationHelper.tapMenu('assistant');
        await AppHelper.removeGlobalMessages();
        await AppHelper.pause(500);
        await FrontPagePage.removeAnnouncements();
        await AppHelper.pause(500);

        const hasTicket: boolean = await TicketFrontpagePage.hasTicket();
        if (hasTicket) {
          const productName = await TicketFrontpagePage.ticketProductName();
          expect(productName).toContain('Single ticket');

          // Inspectable icon
          if (hasMobileTokenOnOtherDevice) {
            expect(await TicketFrontpagePage.ticketIsInspectable()).toBe(false);
            expect(await TicketFrontpagePage.ticketIsNotInspectable()).toBe(true);
          } else {
            expect(await TicketFrontpagePage.ticketIsInspectable()).toBe(true);
            expect(await TicketFrontpagePage.ticketIsNotInspectable()).toBe(false);
          }

          // Details
          performancetotal.sampleStart('openTicketDetails');
          await TicketFrontpagePage.openTicketDetails();
          performancetotal.sampleEnd('openTicketDetails');
          await AppHelper.pause(2000)
          const detailsProductName = await TicketDetailsPage.productName();
          expect(detailsProductName).toContain('Single ticket');

          // Barcode
          if (hasMobileTokenOnThisDevice) {
            expect(await TicketDetailsPage.checkBarcodeType('mobileToken')).toBe(true);
          } else if (hasMobileTokenOnOtherDevice){
            expect(await TicketDetailsPage.checkBarcodeType('notInspectable')).toBe(true);
          }
          else {
            expect(await TicketDetailsPage.checkBarcodeType('static')).toBe(true);
          }

          // Close
          await NavigationHelper.back();
        } else {
          console.log(`[WARN] Ticket not validated due to no existing ticket`);
        }
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_ticket_frontpage_verify');
      throw errMsg;
    }
  });

  /*
    - Disabled check on active ticket page due to the animated bar (very slow test)
    - Check some ticket details if the ticket is valid
    - Check the barcode type depending on the token
   */
  xit('should have a valid ticket in active tickets', async () => {
    try {
      if (authorized) {
        await NavigationHelper.tapMenu('tickets');
        await NavigationHelper.tapTicketTab('activeTickets');

        const hasTicket: boolean = await TicketActivePage.hasTicket();
        if (hasTicket) {
          performancetotal.sampleStart('ticketIsValid');
          let ticketIsValid = await TicketActivePage.isTicketValid();
          performancetotal.sampleEnd('ticketIsValid');
          // Pull to refresh if not valid
          if (!ticketIsValid) {
            await TicketActivePage.pullToRefresh();
            ticketIsValid = await TicketActivePage.isTicketValid();
          }

          if (ticketIsValid) {
            performancetotal.sampleStart('getProductName');
            const productName = await TicketActivePage.productName();
            expect(productName).toContain('Single ticket');
            performancetotal.sampleEnd('getProductName');

            // Details
            performancetotal.sampleStart('openTicketDetails');
            await TicketActivePage.openTicketDetails();
            await ElementHelper.waitForElement('text', 'Ticket details');
            performancetotal.sampleEnd('openTicketDetails');
            const detailsProductName = await TicketDetailsPage.productName();
            expect(detailsProductName).toContain('Single ticket');

            // Barcode
            if (hasMobileTokenOnThisDevice) {
              expect(await TicketDetailsPage.checkBarcodeType('mobileToken')).toBe(true);
            } else if (hasMobileTokenOnOtherDevice){
              expect(await TicketDetailsPage.checkBarcodeType('notInspectable')).toBe(true);
            }
            else {
              expect(await TicketDetailsPage.checkBarcodeType('static')).toBe(true);
            }

            // Close
            await NavigationHelper.back();
          }
        } else {
          console.log(`[WARN] Ticket not validated due to no existing ticket`);
        }
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_ticket_verify');
      throw errMsg;
    }
  });

  it('should log out', async () => {
    if (authorized) {
      try {
        await NavigationHelper.tapMenu('profile');
        await ElementHelper.waitForElement('text', 'Profile');
        await ProfilePage.logout()

      } catch (errMsg) {
        await AppHelper.screenshot('error_auth_logout');
        throw errMsg;
      }
    }
  })
});
