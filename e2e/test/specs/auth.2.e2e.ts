import AppHelper from '../utils/app.helper.ts';
import OnboardingPage from '../pageobjects/onboarding.page.ts';
import NavigationHelper from '../utils/navigation.helper.ts';
import ElementHelper from '../utils/element.helper.ts';
import TicketActivePage from '../pageobjects/ticket.active.page.js';
import TicketDetailsPage from '../pageobjects/ticket.details.page.js';
import MyProfilePage from '../pageobjects/profile.page.js';
import AuthenticationPage from '../pageobjects/authentication.page.js';
import {formatPhoneNumber} from '../utils/utils.js';
import ProfilePage from '../pageobjects/profile.page.js';
import TokenPage from '../pageobjects/token.page.js';
import DebugPage from '../pageobjects/debug.page.js';
import Config from '../conf/config.js';
import {performancetotal} from 'wdio-performancetotal-service';

describe('Auth', () => {
  const phoneNumber = Config.phoneNumber();
  let authorized = false;
  let hasMobileToken = false;

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
      await AppHelper.screenshot('error_auth_login');
      throw errMsg;
    }
  });

  /*
    Check the mobile token toggle in Profile
   */
  it('should have mobile token', async () => {
    try {
      await NavigationHelper.tapMenu('profile');
      await ProfilePage.open('settings');
      await ProfilePage.open('travelToken');
      await ElementHelper.waitForElement('id', 'travelTokenBox');

      // Check if mobile token is OK
      hasMobileToken = await TokenPage.mobileTokenName.isExisting();

      if (hasMobileToken) {
        expect(await TokenPage.tokenToggleInfo).toContain('3 switches left');
        await TokenPage.openTokenToggle();

        // Verify
        expect(await TokenPage.tokenSelection('Travelcard')).toExist();
        expect(await TokenPage.tokenSelection('Mobile')).toExist();
        expect(await TokenPage.tokenSelectionRadio('Mobile')).toBeChecked();
        // Select travel card
        await TokenPage.selectToken('Travelcard');
        expect(await TokenPage.tokenSelectionRadio('Mobile')).not.toBeChecked();
        expect(await TokenPage.noTravelcardWarning).toContain(
          'no t:card registered',
        );
        // Select mobile
        await TokenPage.selectToken('Mobile');
        expect(await TokenPage.selectedDeviceText).toContain('this device');

        await TokenPage.confirmSelection();
        await ElementHelper.waitForElement('id', 'travelTokenBox');
      } else {
        const errorMessage: string = await TokenPage.tokenErrorMessage;
        expect(errorMessage.toLowerCase()).toContain('unable');
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_mobToken');
      throw errMsg;
    }
  });

  /*
    Check mobile token details in debug
   */
  it('should have mobile token debug info', async () => {
    try {
      // Open mobile token section in the debug menu
      await NavigationHelper.tapMenu('profile');
      await AppHelper.scrollDownUntilId('profileHomeScrollView', 'debugButton');
      await ProfilePage.open('debug');
      await AppHelper.scrollDownUntilId(
        'debugInfoScrollView',
        'mobileTokenDebug',
      );
      await DebugPage.open('mobileToken');
      await AppHelper.scrollDown('debugInfoScrollView');

      if (hasMobileToken) {
        expect(await DebugPage.hasMobileTokenId).toBe(true);
        expect(await DebugPage.getMobileTokenStatus()).toBe(
          'success-and-inspectable',
        );
      } else {
        expect(await DebugPage.hasMobileTokenId).toBe(false);
        expect(await DebugPage.getMobileTokenStatus()).toBe('fallback');
      }
      await NavigationHelper.tapMenu('profile');
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_mobToken_debug');
      throw errMsg;
    }
  });

  /*
    - Check some ticket details if the ticket is valid
    - Check the barcode type depending on the token
   */
  it('should have a valid ticket', async () => {
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

            // Barcode
            expect(await TicketDetailsPage.hasBarcode()).toBe(true);
            if (hasMobileToken) {
              const barcodeType = await TicketDetailsPage.getBarcodeType();
              expect(barcodeType).toContain('mobileToken');
            } else {
              const barcodeType = await TicketDetailsPage.getBarcodeType();
              expect(barcodeType).toContain('static');
            }
          }
        } else {
          console.log(`[WARN] Ticket not validated due to no existing ticket`);
        }
      }
    } catch (errMsg) {
      await AppHelper.screenshot('error_auth_verify_buy');
      throw errMsg;
    }
  });
});
