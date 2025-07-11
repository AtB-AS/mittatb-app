import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import TicketBuyPage from '../pageobjects/ticket.buy.page.js';
import PurchaseOverviewPage from '../pageobjects/purchase.overview.page.js';
import PurchaseSummaryPage from '../pageobjects/purchase.summary.page.js';
import TicketActivePage from '../pageobjects/ticket.active.page.js';
import TicketDetailsPage from '../pageobjects/ticket.details.page.js';
import PurchasePaymentPage from '../pageobjects/purchase.payment.page.js';
import MyProfilePage from '../pageobjects/myProfile.page.js';
import AuthenticationPage from '../pageobjects/authentication.page.js';
import {formatPhoneNumber} from '../utils/utils.js';
import {driver} from '@wdio/globals';

describe('Auth 1', () => {
  const phoneNumber = '41111114';
  let authorized = false;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    //await OnboardingPage.skipOnboarding('myProfile');
    //await AppHelper.pause(5000, true);
  });
  beforeEach(async () => {
    /*
    await NavigationHelper.tapMenu('profile');
    await NavigationHelper.tapMenu('profile');
    await ElementHelper.waitForElement('text', 'Profile');
     */
  });
  after(async () => {
    // TODO KOM HIT
    // TODO: Test if app is closed and re-launched ready for describe 2
    // ===> NÆH. Må legge testene i ulike filer og gi navn som gjør at de kjøres etterhverandre
    /*
        If you want strict ordering:
          - Use filenames like 00_login.ts, 01_actions.ts
          - Use a test ordering plugin like wdio-test-order to define execution order explicitly
     */
    // Replace with your actual app package name
    const appPackage = 'no.mittatb.debug';

    await driver.terminateApp(appPackage);  // Closes the app
    await driver.activateApp(appPackage);   // Starts the app again
  });

  /*
  Logg inn
  Sjekk mobile token i debug (status)
  Kjøp billett (?) og sjekk 'mobileTokenBarcode' vs 'staticBarcode'
  Toggle til t:kort og tilbake med sjekker

   */
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
      await AppHelper.screenshot('error_auth_test');
      throw errMsg;
    }
  });

  /*
    Payment:
    ticket-scenario "should have a correct purchase flow"
    check på
      choosePaymentMethodButton
      paymentSelectionItem > confirmPaymentButton
    wait for id 'ticket0'
      productName = Single ticket
      ticket0Details
      (valid | reserving | approved | rejected)Ticket

    availableFCScrollView
      pull down to get tickets
   */
  it('should buy', async () => {
    try {
      if (authorized) {
        await NavigationHelper.tapMenu('tickets');
        //await NavigationHelper.tapMenu('tickets');
        //await ElementHelper.waitForElement('text', 'Tickets');
        await NavigationHelper.tapTicketTab('purchase');

        await TicketBuyPage.chooseFareProduct('single');
        await ElementHelper.waitForElement(
          'text',
          'Single ticket, bus and tram',
        );
        await AppHelper.removeGlobalMessages();

        const totalPrice: number = await PurchaseOverviewPage.getTotalPrice();
        // Ensure an offer
        if (totalPrice > 0) {
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
          /*
          await driver.waitUntil(async () => {
            const activity = await driver.getCurrentActivity();
            return activity.includes('no.mittatb.MainActivity');
          }, {
            timeout: 10000,
            timeoutMsg: 'App did not return to main activity in time'
          });
           */

          /*
          //TODO moved to separate test in a different describe
          await ElementHelper.waitForElementExists('id', 'ticketsTab');
          await NavigationHelper.tapTicketTab('activeTickets');

          //ticket tab - text is purchaseTab, not the button?Single ticket

          // Verify ticket - if valid
          //TODO Går veldig tregt her
          let ticketIsValid = await TicketActivePage.isTicketValid()
          console.log(`=====\nTICKET VALID 1: ${ticketIsValid}\n=====`);
          // Pull to refresh if not valid
          if (!ticketIsValid) {
            await TicketActivePage.pullToRefresh()
          }
          ticketIsValid = await TicketActivePage.isTicketValid()
          console.log(`=====\nTICKET VALID 2: ${ticketIsValid}\n=====`);
          if (ticketIsValid) {
            await AppHelper.pause(20000)
            expect(TicketActivePage.productName).toContain('Single ticket');

            // Details
            await TicketActivePage.openTicketDetails()
            await ElementHelper.waitForElement('text', 'Ticket details');

            expect(await TicketDetailsPage.hasBarcode()).toBe(true);
            const barcodeType = await TicketDetailsPage.getBarcodeType();
            console.log(`=====\nBARCODE TYPE: ${barcodeType}\n=====`);
          }
           */
        }
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_buy');
      throw errMsg;
    }
  });
});

describe('Auth 2', () => {
  const phoneNumber = '41111114';
  let authorized = false;

  before(async () => {
    await AppHelper.waitOnLoadingScreen();
    //await OnboardingPage.skipOnboarding('myProfile');
    //await AppHelper.pause(5000, true);
  });
  beforeEach(async () => {
    /*
    await NavigationHelper.tapMenu('profile');
    await NavigationHelper.tapMenu('profile');
    await ElementHelper.waitForElement('text', 'Profile');
     */
  });

  /*
  Logg inn
  Sjekk mobile token i debug (status)
  Kjøp billett (?) og sjekk 'mobileTokenBarcode' vs 'staticBarcode'
  Toggle til t:kort og tilbake med sjekker

   */
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
      await AppHelper.screenshot('error_auth_test');
      throw errMsg;
    }
  });

  //TODO Denne var satt sammen med "should buy" over. Tester å dele de
  //Må teste å dele opp i ulike describe + legge auth inn som before()
  it('should check buy', async () => {
    try {
      if (authorized) {
        await NavigationHelper.tapMenu('tickets');

        //await ElementHelper.waitForElementExists('id', 'ticketsTab');
        await NavigationHelper.tapTicketTab('activeTickets');

        //ticket tab - text is purchaseTab, not the button?Single ticket
        //--> flytter jeg den til PressableOpacity, så forsvinner tab med testID synlige

        // Verify ticket - if valid
        //TODO Går veldig tregt her
        let ticketIsValid = await TicketActivePage.isTicketValid();
        console.log(`=====\nTICKET VALID 1: ${ticketIsValid}\n=====`);
        // Pull to refresh if not valid
        if (!ticketIsValid) {
          await TicketActivePage.pullToRefresh();
        }
        ticketIsValid = await TicketActivePage.isTicketValid();
        console.log(`=====\nTICKET VALID 2: ${ticketIsValid}\n=====`);
        if (ticketIsValid) {
          await AppHelper.pause(20000);
          expect(TicketActivePage.productName).toContain('Single ticket');

          // Details
          await TicketActivePage.openTicketDetails();
          await ElementHelper.waitForElement('text', 'Ticket details');

          expect(await TicketDetailsPage.hasBarcode()).toBe(true);
          const barcodeType = await TicketDetailsPage.getBarcodeType();
          console.log(`=====\nBARCODE TYPE: ${barcodeType}\n=====`);
        }
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_check_buy');
      throw errMsg;
    }
  });
});
